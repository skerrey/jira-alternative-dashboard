import React, { useState, useEffect, useRef } from "react";
import { FaComments, FaTimes, FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import { Message, Issue } from "../interfaces";

interface AssistantProps {
  onHighlightTicket?: (ticketKey: string) => void;
  issues?: Issue[];
}

const Assistant = ({ onHighlightTicket, issues = [] }: AssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Generate a random delay between 500ms and 1500ms for artificial thinking time
  const getRandomDelay = (): number => {
    return Math.floor(Math.random() * 1000) + 500; // 500-1500ms
  };

  // Extract issue keys from text (format: PROJ-1, PROJ-2, etc.)
  const extractIssueKeys = (text: string): string[] => {
    const regex = /(PROJ-\d+)/gi;
    const matches = text.match(regex);
    if (!matches) return [];
    const unique = Array.from(new Set(matches.map(m => m.toUpperCase())));
    return unique;
  };

  // Render message content with clickable issue references
  const renderMessageContent = (content: string) => {
    const issueKeys = extractIssueKeys(content);
    if (issueKeys.length === 0) {
      return <span>{content}</span>;
    }

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;
    
    // Split content by issue keys and make them clickable
    issueKeys.forEach((issueKey, idx) => {
      const regex = new RegExp(`(${issueKey})`, "gi");
      const match = content.substring(lastIndex).search(regex);
      
      if (match !== -1) {
        const matchIndex = lastIndex + match;
        // Add text before the match
        if (matchIndex > lastIndex) {
          parts.push(content.substring(lastIndex, matchIndex));
        }
        // Add clickable issue key
        parts.push(
          <button
            key={`${issueKey}-${idx}`}
            onClick={(e) => {
              e.preventDefault();
              if (onHighlightTicket) {
                onHighlightTicket(issueKey);
              }
            }}
            className="font-mono font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
            title={`Click to highlight ${issueKey}`}
          >
            {issueKey}
          </button>
        );
        lastIndex = matchIndex + issueKey.length;
      }
    });
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }
    
    return <span>{parts}</span>;
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Fetch initial usage stats
    const fetchUsageStats = async () => {
      try {
        const response = await axios.get("/api/assistant/usage");
        setRemainingAttempts(response.data.remaining || 10);
      } catch (error) {
        console.error("Error fetching usage stats:", error);
      }
    };
    fetchUsageStats();
  }, []);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (isLoading) return;
    
    // Create user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: suggestion,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Send the suggestion as a message
    const sendSuggestion = async () => {
      try {
        const conversationHistory = messages.map((m) => ({
          role: m.role,
          content: m.content
        }));

        const response = await axios.post("/api/assistant/chat", {
          message: suggestion,
          sessionId: "default",
          conversationHistory
        });

        // Add artificial thinking delay (500ms - 1500ms)
        const delay = getRandomDelay();
        await new Promise(resolve => setTimeout(resolve, delay));

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.response,
          suggestions: response.data.suggestions || [],
          timestamp: new Date(),
          source: response.data.source || "preloaded"
        };

        setMessages((prev) => [...prev, assistantMessage]);
        // Update attempts counter - only decrease if AI was used
        if (response.data.source === "openai" || response.data.source === "ai-assisted") {
          setRemainingAttempts(response.data.remainingAttempts ?? remainingAttempts);
        } else {
          // For preloaded responses, just update if the value changed (shouldn't decrease)
          if (response.data.remainingAttempts !== undefined) {
            setRemainingAttempts(response.data.remainingAttempts);
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your message. Please try again.",
          timestamp: new Date(),
          source: "error"
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    sendSuggestion();
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const messageText = message.trim();
    if (messageText && !isLoading) {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, userMessage]);
      setMessage("");
      setIsLoading(true);

      try {
        const conversationHistory = messages.map((m) => ({
          role: m.role,
          content: m.content
        }));

        const response = await axios.post("/api/assistant/chat", {
          message: userMessage.content,
          sessionId: "default",
          conversationHistory
        });

        // Add artificial thinking delay (500ms - 1500ms)
        const delay = getRandomDelay();
        await new Promise(resolve => setTimeout(resolve, delay));

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: response.data.response,
          suggestions: response.data.suggestions || [],
          timestamp: new Date(),
          source: response.data.source || "preloaded"
        };

        setMessages((prev) => [...prev, assistantMessage]);
        // Update attempts counter - only decrease if AI was used
        if (response.data.source === "openai" || response.data.source === "ai-assisted") {
          setRemainingAttempts(response.data.remainingAttempts ?? remainingAttempts);
        } else {
          // For preloaded responses, just update if the value changed (shouldn't decrease)
          if (response.data.remainingAttempts !== undefined) {
            setRemainingAttempts(response.data.remainingAttempts);
          }
        }
      } catch (error) {
        console.error("Error sending message:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "I'm sorry, I encountered an error processing your message. Please try again.",
          timestamp: new Date(),
          source: "error"
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <>
      {/* Chatbox */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col z-50 animate-fade-in-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#172b4d] to-[#1e3a5f] text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <FaComments className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">AI Assistant</h3>
                <p className="text-xs text-white text-opacity-80">
                  {remainingAttempts > 0 ? `${remainingAttempts} AI attempts remaining` : "Knowledge base only"}
                </p>
              </div>
            </div>
            <button
              onClick={toggleChat}
              className="p-1.5 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <FaTimes className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#172b4d] rounded-full flex items-center justify-center flex-shrink-0">
                    <FaComments className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex flex-col max-w-[80%]">
                    <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                      <p className="text-sm text-gray-700">
                        Hello! I'm your AI assistant. I can help you understand your project issues, provide insights, and answer questions. How can I help you today?
                      </p>
                      <p className="text-xs mt-2 text-gray-400">📚 Knowledge Base</p>
                    </div>
                    <div className="mt-2 flex flex-col gap-2">
                      {[
                        "What issues are in progress?",
                        "Show me project statistics",
                        "Who is working on what?"
                      ].map((suggestion, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSuggestionClick(suggestion)}
                          disabled={isLoading}
                          className="text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 bg-[#172b4d] rounded-full flex items-center justify-center flex-shrink-0">
                      <FaComments className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {msg.role === "user" && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">You</span>
                    </div>
                  )}
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`rounded-lg p-3 shadow-sm border ${
                        msg.role === "user"
                          ? "bg-blue-500 text-white border-blue-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      <div className={`text-sm whitespace-pre-wrap ${msg.role === "user" ? "text-white" : "text-gray-700"}`}>
                        {msg.role === "assistant" ? renderMessageContent(msg.content) : msg.content}
                      </div>
                    {msg.role === "assistant" && msg.source && msg.source !== "error" && (
                      <p className="text-xs mt-2 text-gray-400">
                        {msg.source === "openai" 
                          ? "🤖 AI Generated" 
                          : msg.source === "ai-assisted"
                          ? "🤖✨ AI-Assisted"
                          : "📚 Knowledge Base"}
                      </p>
                    )}
                    </div>
                    {msg.role === "assistant" && msg.suggestions && msg.suggestions.length > 0 && (
                      <div className="mt-2 flex flex-col gap-2">
                        {msg.suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={isLoading}
                            className="text-left px-4 py-2 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg text-sm text-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-[#172b4d] rounded-full flex items-center justify-center flex-shrink-0">
                    <FaComments className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-lg text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                autoFocus
              />
              <button
                type="submit"
                disabled={!message.trim() || isLoading}
                className="px-4 py-2 bg-[#172b4d] text-white rounded-lg hover:bg-[#0f1e3a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                aria-label="Send message"
              >
                <FaPaperPlane className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600 rotate-90"
            : "bg-[#172b4d] hover:bg-[#0f1e3a] hover:scale-110"
        }`}
        aria-label={isOpen ? "Close assistant" : "Open assistant"}
      >
        {isOpen ? (
          <FaTimes className="w-6 h-6 text-white" />
        ) : (
          <FaComments className="w-6 h-6 text-white" />
        )}
      </button>
    </>
  );
};

export default Assistant;

