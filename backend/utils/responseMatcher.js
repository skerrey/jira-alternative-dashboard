// Response matcher utility for keyword-based matching
const assistantResponses = require("../data/assistantResponses");

/**
 * Normalize a string for matching (lowercase, remove punctuation)
 */
const normalizeText = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

/**
 * Extract keywords from a query
 */
const extractKeywords = (query) => {
  const normalized = normalizeText(query);
  // Split into words and filter out common stop words
  const stopWords = new Set([
    "a", "an", "and", "are", "as", "at", "be", "by", "for", "from",
    "has", "he", "in", "is", "it", "its", "of", "on", "that", "the",
    "to", "was", "will", "with", "the", "this", "but", "they", "have",
    "had", "what", "said", "each", "which", "their", "if", "up", "out",
    "many", "then", "them", "these", "so", "some", "her", "would", "make",
    "like", "into", "him", "has", "two", "more", "very", "after", "words"
  ]);
  
  return normalized
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));
};

/**
 * Calculate match score for a response based on keywords
 */
const calculateMatchScore = (response, queryKeywords, query) => {
  if (!response.keywords || response.keywords.length === 0) {
    return 0; // No keywords means fallback only
  }
  
  const normalizedQuery = normalizeText(query);
  let score = 0;
  let matchedKeywords = 0;
  
  // Check each keyword in the response
  for (const keyword of response.keywords) {
    const normalizedKeyword = normalizeText(keyword);
    
    // Exact phrase match (highest score)
    if (normalizedQuery.includes(normalizedKeyword)) {
      score += 100;
      matchedKeywords++;
    }
    // Check if any query keyword matches this response keyword
    else if (queryKeywords.some(qk => normalizedKeyword.includes(qk) || qk.includes(normalizedKeyword))) {
      score += 70;
      matchedKeywords++;
    }
    // Fuzzy match (partial)
    else if (queryKeywords.some(qk => 
      normalizedKeyword.includes(qk.substring(0, 3)) || 
      qk.includes(normalizedKeyword.substring(0, 3))
    )) {
      score += 50;
      matchedKeywords++;
    }
  }
  
  // Boost score based on priority
  score += response.priority || 0;
  
  // Boost if multiple keywords matched
  if (matchedKeywords > 1) {
    score += matchedKeywords * 10;
  }
  
  // Boost if all keywords matched
  if (matchedKeywords === response.keywords.length && response.keywords.length > 1) {
    score += 50;
  }
  
  return score;
};

/**
 * Find the best matching response for a query
 * @param {string} query - User's query
 * @param {object} data - Project data (issues, users, columns, etc.)
 * @returns {object|null} - Best matching response object with score
 */
const findBestMatch = (query, data) => {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return null;
  }
  
  const queryKeywords = extractKeywords(query);
  const normalizedQuery = normalizeText(query);
  
  // Score all responses
  const scoredResponses = assistantResponses
    .map(response => ({
      response,
      score: calculateMatchScore(response, queryKeywords, normalizedQuery)
    }))
    .filter(item => item.score > 0) // Only keep matches
    .sort((a, b) => b.score - a.score); // Sort by score descending
  
  if (scoredResponses.length === 0) {
    // Return fallback response
    const fallback = assistantResponses.find(r => r.category === "fallback");
    return fallback ? { response: fallback, score: 0 } : null;
  }
  
  // Return the best match
  return scoredResponses[0];
};

/**
 * Get top N candidate responses for AI-assisted selection
 * @param {string} query - User's query
 * @param {object} data - Project data
 * @param {number} topN - Number of top candidates to return (default: 3)
 * @param {number} minScore - Minimum score threshold (default: 20)
 * @returns {array} - Array of candidate responses with scores
 */
const getTopCandidates = (query, data, topN = 3, minScore = 20) => {
  if (!query || typeof query !== "string" || query.trim().length === 0) {
    return [];
  }
  
  const queryKeywords = extractKeywords(query);
  const normalizedQuery = normalizeText(query);
  
  // Score all responses
  const scoredResponses = assistantResponses
    .map(response => ({
      response,
      score: calculateMatchScore(response, queryKeywords, normalizedQuery)
    }))
    .filter(item => item.score >= minScore) // Only keep matches above threshold
    .sort((a, b) => b.score - a.score) // Sort by score descending
    .slice(0, topN); // Get top N
  
  return scoredResponses;
};

/**
 * Get status breakdown of issues
 */
const getStatusBreakdown = (data) => {
  const issues = data.issues || [];
  if (issues.length === 0) return "No issues found.";
  
  const statusGroups = {};
  issues.forEach(issue => {
    const status = issue.fields?.status?.name || "Unknown";
    if (!statusGroups[status]) {
      statusGroups[status] = [];
    }
    statusGroups[status].push(issue);
  });
  
  const statusList = Object.entries(statusGroups)
    .map(([status, issueList]) => {
      const issueKeys = issueList.slice(0, 3).map(i => i.key).join(", ");
      const more = issueList.length > 3 ? ` (+${issueList.length - 3} more)` : "";
      return `• ${status}: ${issueList.length} issue${issueList.length !== 1 ? "s" : ""} (${issueKeys}${more})`;
    })
    .join("\n");
  
  return statusList;
};

/**
 * Check if query is an affirmative response (yes, y, yeah, etc.)
 */
const isAffirmative = (query) => {
  const normalized = normalizeText(query);
  const affirmativeWords = ["yes", "y", "ye", "yeah", "yep", "yup", "sure", "ok", "okay", "alright", "definitely", "absolutely"];
  return affirmativeWords.some(word => normalized === word || normalized.startsWith(word + " "));
};

/**
 * Get response text for a query
 * @param {string} query - User's query
 * @param {object} data - Project data
 * @param {array} conversationHistory - Previous messages for context
 * @returns {object} - { text: string, source: "preloaded", category: string }
 */
const getResponse = (query, data = {}, conversationHistory = []) => {
  // Handle affirmative responses by checking conversation history
  if (isAffirmative(query) && conversationHistory.length > 0) {
    // Get the last assistant message to understand context
    const lastAssistantMessage = [...conversationHistory].reverse().find(msg => msg.role === "assistant");
    
    if (lastAssistantMessage && lastAssistantMessage.content) {
      const lastMessage = lastAssistantMessage.content.toLowerCase();
      
      // Check what the assistant was asking about
      if (lastMessage.includes("status") || lastMessage.includes("priority")) {
        // User wants to see issues by status/priority
        return {
          text: "Here's an overview of issues by status:\n\n" + 
                getStatusBreakdown(data) + 
                "\n\nWould you like to see issues by priority instead, or dive into a specific status?",
          suggestions: [],
          source: "preloaded",
          category: "issue",
          score: 100
        };
      } else if (lastMessage.includes("specific issue")) {
        // User wants to know about a specific issue
        const issueList = (data.issues || []).slice(0, 10).map(i => 
          `• ${i.key}: ${i.fields?.summary}`
        ).join("\n");
        return {
          text: `Here are the issues in the project:\n\n${issueList}${(data.issues || []).length > 10 ? `\n\n...and ${(data.issues || []).length - 10} more.` : ""}\n\nWhich issue would you like to know more about?`,
          suggestions: [],
          source: "preloaded",
          category: "issue",
          score: 100
        };
      } else if (lastMessage.includes("statistics") || lastMessage.includes("stats")) {
        // User wants to see statistics
        const statsResponse = assistantResponses.find(r => r.id === "project-2");
        if (statsResponse && typeof statsResponse.response === "function") {
          const result = statsResponse.response(data);
          return {
            text: result,
            suggestions: [],
            source: "preloaded",
            category: "project",
            score: 100
          };
        }
      }
    }
  }
  
  const match = findBestMatch(query, data);
  
  if (!match || !match.response) {
    return {
      text: "Hmm, I'm not quite sure how to help you with that.",
      suggestions: [
        "What issues are in progress?",
        "Show me project statistics",
        "Who is working on what?"
      ],
      source: "preloaded",
      category: "fallback"
    };
  }
  
  const responseObj = match.response;
  let responseResult;
  
  // If response is a function, call it with data and query
  if (typeof responseObj.response === "function") {
    try {
      responseResult = responseObj.response(data, query);
    } catch (error) {
      console.error("Error generating response:", error);
      responseResult = "I encountered an error while generating a response. Please try again.";
    }
  } else {
    responseResult = responseObj.response;
  }
  
  // Handle response that might be an object
  if (typeof responseResult === "object" && responseResult !== null) {
    return {
      text: responseResult.text || "",
      suggestions: responseResult.suggestions || [],
      source: "preloaded",
      category: responseObj.category,
      score: match.score
    };
  }
  
  // Handle string response
  return {
    text: responseResult,
    suggestions: [],
    source: "preloaded",
    category: responseObj.category,
    score: match.score
  };
};

module.exports = {
  findBestMatch,
  getResponse,
  getTopCandidates,
  extractKeywords,
  calculateMatchScore,
  isAffirmative
};

