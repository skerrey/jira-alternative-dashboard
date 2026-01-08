// OpenAI service for AI-powered responses
const OpenAI = require("openai");
const assistantResponses = require("../data/assistantResponses");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || ""
});

/**
 * Build knowledge base from all preloaded responses
 * @param {object} data - Project data for generating sample responses
 */
const buildKnowledgeBase = (data = {}) => {
  const knowledgeBaseParts = [];
  
  // Group responses by category
  const categories = {};
  assistantResponses.forEach(response => {
    if (!categories[response.category]) {
      categories[response.category] = [];
    }
    categories[response.category].push(response);
  });
  
  // Build knowledge base structure
  knowledgeBaseParts.push("KNOWLEDGE BASE - Preloaded Responses by Category:\n");
  knowledgeBaseParts.push("=" .repeat(60) + "\n");
  
  Object.entries(categories).forEach(([category, responses]) => {
    if (category === "fallback") return; // Skip fallback responses
    
    knowledgeBaseParts.push(`\n[${category.toUpperCase()}]`);
    responses.forEach(response => {
      knowledgeBaseParts.push(`\nKeywords: ${response.keywords?.join(", ") || "none"}`);
      
      // Try to get a sample response if it's a function
      let sampleResponse = "";
      if (typeof response.response === "function") {
        try {
          // Call with actual data to get a realistic sample
          const result = response.response(data, "example query");
          if (typeof result === "object" && result !== null) {
            sampleResponse = result.text || "";
            if (result.suggestions && result.suggestions.length > 0) {
              sampleResponse += `\n(Suggestions available: ${result.suggestions.join(", ")})`;
            }
          } else {
            sampleResponse = result || "";
          }
        } catch (e) {
          sampleResponse = "Response function available";
        }
      } else {
        sampleResponse = response.response || "";
      }
      
      // Truncate very long responses for knowledge base (but keep more content)
      if (sampleResponse.length > 300) {
        sampleResponse = sampleResponse.substring(0, 300) + "...";
      }
      knowledgeBaseParts.push(`Response Example: ${sampleResponse}`);
    });
  });
  
  return knowledgeBaseParts.join("\n");
};

/**
 * Build context from project data for OpenAI prompt
 */
const buildContext = (data) => {
  const contextParts = [];
  
  if (data.projectName) {
    contextParts.push(`Project: ${data.projectName}`);
  }
  
  if (data.issues && data.issues.length > 0) {
    const issueSummary = data.issues.slice(0, 10).map(issue => {
      const status = issue.fields?.status?.name || "Unknown";
      const assignee = issue.fields?.assignee?.displayName || "Unassigned";
      const priority = issue.fields?.priority?.name || "Medium";
      return `- ${issue.key}: "${issue.fields?.summary}" (Status: ${status}, Assignee: ${assignee}, Priority: ${priority})`;
    }).join("\n");
    contextParts.push(`\nIssues:\n${issueSummary}`);
    
    if (data.issues.length > 10) {
      contextParts.push(`\n...and ${data.issues.length - 10} more issues.`);
    }
  }
  
  if (data.users && data.users.length > 0) {
    const userList = data.users.map(u => `- ${u.displayName}`).join("\n");
    contextParts.push(`\nTeam Members:\n${userList}`);
  }
  
  if (data.columns && data.columns.length > 0) {
    const columnList = data.columns.map(c => `- ${c.name}`).join(", ");
    contextParts.push(`\nWorkflow Columns: ${columnList}`);
  }
  
  return contextParts.join("\n");
};

/**
 * Generate AI response using OpenAI
 * @param {string} query - User's question
 * @param {object} data - Project data for context
 * @param {array} conversationHistory - Previous messages for context (optional)
 * @returns {Promise<object>} - { text: string, tokensUsed: number }
 */
const generateResponse = async (query, data = {}, conversationHistory = []) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI API key not configured");
  }
  
  const context = buildContext(data);
  const knowledgeBase = buildKnowledgeBase(data);
  console.log(`[OpenAI Service] Knowledge base built with ${assistantResponses.length} preloaded responses (including all categories and examples)`);
  
  // Build conversation messages
  const messages = [
    {
      role: "system",
      content: `You are a helpful AI assistant for a Jira dashboard alternative project management tool. You help users understand their project, find issues, track work, and navigate the dashboard.

KNOWLEDGE BASE:
${knowledgeBase}

PROJECT CONTEXT:
${context}

INSTRUCTIONS:
- Use the knowledge base above as your primary reference - it contains all available responses, keywords, and examples
- You have access to all preloaded responses and their keywords - use these as guides for appropriate responses
- Be concise and helpful, but natural and conversational
- If asked about specific issues, use the issue keys (e.g., PROJ-1) - make them clickable by including the full key format
- Format responses clearly with bullet points when listing items
- When listing issues, include their key (e.g., PROJ-1) and summary in the format shown in knowledge base
- If the user says "yes" or "y" to a question, infer what they're agreeing to from conversation context
- For assignment queries, group by assignee name and show issues under each person
- For status queries, show issues grouped by status column
- Reference the knowledge base examples to match the style and format of responses
- Keep responses natural while following the knowledge base structure and examples`
    }
  ];
  
  // Add conversation history (last 5 messages to save tokens)
  const recentHistory = conversationHistory.slice(-5);
  recentHistory.forEach(msg => {
    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content: msg.content
    });
  });
  
  // Add current query
  messages.push({
    role: "user",
    content: query
  });
  
  try {
    console.log(`[OpenAI Service] Making API call with ${messages.length} messages (including system prompt and history)`);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 300, // Limit tokens for cost control
      temperature: 0.7
    });
    
    const responseText = completion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    const tokensUsed = completion.usage?.total_tokens || 0;
    console.log(`[OpenAI Service] API call successful. Tokens - prompt: ${completion.usage?.prompt_tokens || 0}, completion: ${completion.usage?.completion_tokens || 0}, total: ${tokensUsed}`);
    
    return {
      text: responseText,
      tokensUsed: tokensUsed
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    
    // Handle specific errors
    if (error.status === 401) {
      throw new Error("Invalid OpenAI API key");
    } else if (error.status === 429) {
      throw new Error("OpenAI API rate limit exceeded. Please try again later.");
    } else if (error.status === 500) {
      throw new Error("OpenAI API service error. Please try again later.");
    }
    
    throw new Error(`OpenAI API error: ${error.message || "Unknown error"}`);
  }
};

/**
 * Use AI to select the best preloaded response from candidates
 * @param {string} query - User's query
 * @param {array} candidates - Array of candidate responses with scores
 * @param {object} data - Project data for context
 * @returns {Promise<object>} - { selectedIndex: number, reasoning: string, tokensUsed: number }
 */
const selectBestCandidate = async (query, candidates, data = {}) => {
  if (!process.env.OPENAI_API_KEY || !candidates || candidates.length === 0) {
    return { selectedIndex: 0, reasoning: "No AI available, using top scored response", tokensUsed: 0 };
  }
  
  // Build candidate descriptions for AI
  const candidateDescriptions = candidates.map((candidate, idx) => {
    const responseObj = candidate.response;
    let previewText = "";
    
    // Try to get a preview of the response
    if (typeof responseObj.response === "function") {
      try {
        const result = responseObj.response(data, query);
        previewText = typeof result === "object" ? result.text || "" : result || "";
        // Truncate if too long
        if (previewText.length > 150) {
          previewText = previewText.substring(0, 150) + "...";
        }
      } catch (e) {
        previewText = "Response generation preview unavailable";
      }
    } else {
      previewText = responseObj.response || "";
      if (previewText.length > 150) {
        previewText = previewText.substring(0, 150) + "...";
      }
    }
    
    return `${idx + 1}. Category: ${responseObj.category || "unknown"}, Keywords: ${responseObj.keywords?.join(", ") || "none"}, Score: ${candidate.score}, Preview: "${previewText}"`;
  }).join("\n\n");
  
  const context = buildContext(data);
  
  const messages = [
    {
      role: "system",
      content: `You are helping select the best preloaded response for a user query in a Jira dashboard assistant. You will be given a user query and several candidate responses with their categories, keywords, scores, and previews. Select the number (1-${candidates.length}) of the best matching response. Keep your response very brief - just the number and a one-sentence explanation.`
    },
    {
      role: "user",
      content: `User Query: "${query}"\n\nProject Context:\n${context}\n\nCandidate Responses:\n${candidateDescriptions}\n\nWhich candidate (1-${candidates.length}) best matches the user's query? Respond with just the number and a brief explanation.`
    }
  ];
  
  try {
    console.log(`[OpenAI Service] Selecting best candidate from ${candidates.length} options`);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 100, // Very brief response
      temperature: 0.3 // Lower temperature for more consistent selection
    });
    
    const aiResponse = completion.choices[0]?.message?.content || "1";
    const tokensUsed = completion.usage?.total_tokens || 0;
    console.log(`[OpenAI Service] Candidate selection API call successful. Tokens used: ${tokensUsed}, AI selected: "${aiResponse.trim()}"`);
    
    // Extract number from response (e.g., "1" or "Option 1" or "1. Because...")
    const match = aiResponse.match(/\b([1-9])\b/);
    let selectedIndex = 0;
    if (match && match[1]) {
      const num = parseInt(match[1], 10);
      if (num >= 1 && num <= candidates.length) {
        selectedIndex = num - 1; // Convert to 0-based index
      }
    }
    
    return {
      selectedIndex,
      reasoning: aiResponse.trim(),
      tokensUsed
    };
  } catch (error) {
    console.error("Error in AI candidate selection:", error);
    // Fallback to highest scored candidate
    return { selectedIndex: 0, reasoning: "AI selection failed, using top scored response", tokensUsed: 0 };
  }
};

/**
 * Use AI to enhance a preloaded response with context
 * @param {string} query - User's query
 * @param {string} preloadedResponse - The preloaded response text
 * @param {object} data - Project data for context
 * @returns {Promise<object>} - { enhancedText: string, tokensUsed: number }
 */
const enhancePreloadedResponse = async (query, preloadedResponse, data = {}) => {
  if (!process.env.OPENAI_API_KEY || !preloadedResponse) {
    return { enhancedText: preloadedResponse, tokensUsed: 0 };
  }
  
  const context = buildContext(data);
  
  const messages = [
    {
      role: "system",
      content: `You are enhancing a preloaded response for a Jira dashboard assistant. The response is already accurate but you may add brief contextual information if it helps answer the user's query better. Keep it concise - the response should stay roughly the same length. If the response is already perfect, return it as-is.`
    },
    {
      role: "user",
      content: `User Query: "${query}"\n\nProject Context:\n${context}\n\nPreloaded Response:\n"${preloadedResponse}"\n\nProvide an enhanced version if helpful, or return the original if it's already perfect.`
    }
  ];
  
  try {
    console.log(`[OpenAI Service] Enhancing preloaded response (original length: ${preloadedResponse.length} chars)`);
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: messages,
      max_tokens: 400, // Allow some enhancement but not too much
      temperature: 0.5
    });
    
    const enhancedText = completion.choices[0]?.message?.content?.trim() || preloadedResponse;
    const tokensUsed = completion.usage?.total_tokens || 0;
    console.log(`[OpenAI Service] Enhancement API call successful. Tokens used: ${tokensUsed}, enhanced length: ${enhancedText.length} chars, changed: ${enhancedText !== preloadedResponse}`);
    
    // Remove quotes if AI wrapped the response in quotes
    const cleanedText = enhancedText.replace(/^["']|["']$/g, "");
    
    return {
      enhancedText: cleanedText || preloadedResponse,
      tokensUsed
    };
  } catch (error) {
    console.error("Error enhancing preloaded response:", error);
    return { enhancedText: preloadedResponse, tokensUsed: 0 };
  }
};

/**
 * Check if OpenAI is available and configured
 */
const isAvailable = () => {
  return !!(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.trim().length > 0);
};

module.exports = {
  generateResponse,
  selectBestCandidate,
  enhancePreloadedResponse,
  isAvailable,
  buildContext
};

