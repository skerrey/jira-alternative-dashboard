// Token manager for tracking OpenAI API usage
// Uses in-memory storage (resets on server restart)

const MAX_ATTEMPTS = parseInt(process.env.OPENAI_MAX_ATTEMPTS || "10", 10);

// In-memory storage: sessionId -> attempt count
const attemptCounts = new Map();

// Track attempts per session (default session is "default")
let defaultSessionCount = 0;

/**
 * Get remaining attempts for a session
 * @param {string} sessionId - Session identifier (default: "default")
 * @returns {number} - Remaining attempts
 */
const getRemainingAttempts = (sessionId = "default") => {
  const count = sessionId === "default" 
    ? defaultSessionCount 
    : (attemptCounts.get(sessionId) || 0);
  return Math.max(0, MAX_ATTEMPTS - count);
};

/**
 * Check if OpenAI API can be used (has remaining attempts)
 * @param {string} sessionId - Session identifier
 * @returns {boolean}
 */
const canUseOpenAI = (sessionId = "default") => {
  return getRemainingAttempts(sessionId) > 0;
};

/**
 * Record an OpenAI API usage attempt
 * @param {string} sessionId - Session identifier
 * @returns {number} - Remaining attempts after this use
 */
const recordAttempt = (sessionId = "default") => {
  if (sessionId === "default") {
    defaultSessionCount++;
    return getRemainingAttempts(sessionId);
  } else {
    const current = attemptCounts.get(sessionId) || 0;
    attemptCounts.set(sessionId, current + 1);
    return getRemainingAttempts(sessionId);
  }
};

/**
 * Reset attempts for a session
 * @param {string} sessionId - Session identifier (optional, resets all if not provided)
 */
const resetAttempts = (sessionId) => {
  if (sessionId) {
    if (sessionId === "default") {
      defaultSessionCount = 0;
    } else {
      attemptCounts.delete(sessionId);
    }
  } else {
    // Reset all
    defaultSessionCount = 0;
    attemptCounts.clear();
  }
};

/**
 * Get usage statistics
 * @param {string} sessionId - Session identifier
 * @returns {object} - { used: number, remaining: number, max: number }
 */
const getUsageStats = (sessionId = "default") => {
  const used = sessionId === "default"
    ? defaultSessionCount
    : (attemptCounts.get(sessionId) || 0);
  
  return {
    used,
    remaining: getRemainingAttempts(sessionId),
    max: MAX_ATTEMPTS
  };
};

module.exports = {
  getRemainingAttempts,
  canUseOpenAI,
  recordAttempt,
  resetAttempts,
  getUsageStats,
  MAX_ATTEMPTS
};

