// Assistant API routes
const express = require("express");
const router = express.Router();

// Import utilities and services
const { getResponse } = require("../utils/responseMatcher");
const { 
  generateResponse,
  isAvailable 
} = require("../services/openaiService");
const { 
  canUseOpenAI, 
  recordAttempt, 
  getUsageStats,
  getRemainingAttempts 
} = require("../utils/tokenManager");

// Import mock data for context
const mockColumns = require("../data/columns");
const mockUsers = require("../data/users");
const mockProjectName = require("../data/project");
const mockIssues = require("../data/issues");

/**
 * Get project data for context
 * This can be enhanced to fetch real data from Jira if needed
 */
const getProjectData = async () => {
  // For now, return mock data
  // In the future, this could fetch from Jira API or database
  return {
    issues: mockIssues,
    users: mockUsers,
    columns: mockColumns,
    projectName: mockProjectName
  };
};

/**
 * POST /api/assistant/chat
 * Handle chat messages from the assistant
 */
router.post("/chat", async (req, res) => {
  try {
    const { message, sessionId = "default" } = req.body;
    
    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return res.status(400).json({
        error: "Message is required",
        response: "Please provide a message.",
        source: "error"
      });
    }
    
    const trimmedMessage = message.trim();
    
    // Get project data for context
    const projectData = await getProjectData();
    
    // Get conversation history for context
    const conversationHistory = req.body.conversationHistory || [];
    
    // USE AI FIRST - if available and has remaining attempts
    if (isAvailable() && canUseOpenAI(sessionId)) {
      try {
        console.log(`[OpenAI] Using AI FIRST for query: "${trimmedMessage}" (remaining attempts: ${getRemainingAttempts(sessionId)})`);
        
        // Generate AI response with full knowledge base access
        const aiResponse = await generateResponse(
          trimmedMessage,
          projectData,
          conversationHistory
        );
        
        // Record attempt after successful call
        const remainingAfter = recordAttempt(sessionId);
        console.log(`[OpenAI] AI response generated successfully. Tokens used: ${aiResponse.tokensUsed}, remaining attempts: ${remainingAfter}`);
        
        return res.json({
          response: aiResponse.text,
          source: "openai",
          tokensUsed: aiResponse.tokensUsed,
          remainingAttempts: remainingAfter
        });
      } catch (openaiError) {
        console.error("[OpenAI] Error generating AI response:", openaiError);
        console.log("[OpenAI] Falling back to preloaded responses");
        // Fall through to preloaded responses
      }
    }
    
    // FALLBACK: Use preloaded responses if AI unavailable or failed
    console.log("[OpenAI] Using preloaded responses (fallback)");
    const preloadedResponse = getResponse(trimmedMessage, projectData, conversationHistory);
    
    // Return preloaded response (fallback when AI unavailable or failed)
    const usageStats = getUsageStats(sessionId);
    
    let responseText = preloadedResponse.text;
    if (!canUseOpenAI(sessionId) && isAvailable()) {
      responseText += `\n\n(Note: OpenAI API attempts exhausted for this session. ${usageStats.remaining} of ${usageStats.max} attempts remaining. Using knowledge base.)`;
    } else if (!isAvailable()) {
      console.log("[OpenAI] OpenAI not available, using preloaded responses");
    }
    
    return res.json({
      response: responseText,
      suggestions: preloadedResponse.suggestions || [],
      source: "preloaded",
      remainingAttempts: usageStats.remaining,
      maxAttempts: usageStats.max
    });
    
  } catch (error) {
    console.error("Assistant chat error:", error);
    return res.status(500).json({
      error: "Internal server error",
      response: "I encountered an error processing your request. Please try again.",
      source: "error"
    });
  }
});

/**
 * GET /api/assistant/usage
 * Get usage statistics for a session
 */
router.get("/usage", (req, res) => {
  try {
    const { sessionId = "default" } = req.query;
    const stats = getUsageStats(sessionId);
    
    return res.json({
      ...stats,
      openaiAvailable: isAvailable()
    });
  } catch (error) {
    console.error("Usage stats error:", error);
    return res.status(500).json({
      error: "Failed to get usage statistics"
    });
  }
});

module.exports = router;

