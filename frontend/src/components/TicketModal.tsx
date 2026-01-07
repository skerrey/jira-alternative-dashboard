import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { TicketModalProps, Issue, Comment } from "../interfaces";
import { getPriorityColor } from "../utils/getPriorityColor";
import { FaUser, FaUserCircle, FaFlag, FaTag, FaCalendar, FaClock, FaCheckCircle, FaTimes, FaComments } from "react-icons/fa";

const TicketModal = ({ issue, onClose }: TicketModalProps) => {
  const [fullIssue, setFullIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFullIssueDetails = useCallback(async (issueKey: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Issue>(`/api/jira/issue/${issueKey}`);
      setFullIssue(response.data);
    } catch (err: any) {
      console.error("Error fetching issue details:", err);
      console.error("Error response:", err.response?.data);
      setError("Failed to load issue details");
      // Fallback to basic issue data
      if (issue) {
        setFullIssue(issue);
      }
    } finally {
      setLoading(false);
    }
  }, [issue]);

  useEffect(() => {
    if (issue) {
      fetchFullIssueDetails(issue.key);
    }
  }, [issue, fetchFullIssueDetails]);

  if (!issue) return null;

  const displayIssue = fullIssue || issue;
  const { fields, renderedFields } = displayIssue;

  // Helper function to extract text from Jira document structure
  const extractTextFromDocument = (doc: any): string => {
    if (typeof doc === "string") return doc;
    if (!doc || typeof doc !== "object") return "";
    
    if (doc.content && Array.isArray(doc.content)) {
      return doc.content
        .map((item: any) => {
          if (item.type === "text" && item.text) {
            return item.text;
          }
          if (item.content && Array.isArray(item.content)) {
            return item.content
              .map((subItem: any) => subItem.text || "")
              .join("");
          }
          return "";
        })
        .join("\n");
    }
    return "";
  };

  // Get description - prefer renderedFields (HTML) or parse document structure
  const getDescription = (): string => {
    if (renderedFields?.description) {
      return renderedFields.description;
    }
    if (fields.description) {
      if (typeof fields.description === "string") {
        return fields.description;
      }
      return extractTextFromDocument(fields.description);
    }
    return "";
  };

  const description = getDescription();

  const priorityColor = fields.priority ? getPriorityColor(fields.priority.name) : "";

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col border border-gray-200">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-gray-700 font-mono">{issue.key}</span>
            {fields.status && (
              <span className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                {fields.status.name}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg p-2 transition-all"
            aria-label="Close modal"
          >
            <FaTimes className="w-4 h-4" />
          </button>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="flex flex-1 overflow-hidden min-w-0">
          {/* Left Panel - Content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden px-8 py-6 border-r border-gray-200 bg-white min-w-0">
            {loading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-4 border-[#172b4d] border-t-transparent"></div>
              </div>
            )}
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {!loading && (
              <div className="space-y-8 w-full max-w-full">
                {/* Title */}
                <div className="pb-4 border-b border-gray-200 w-full">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2 leading-tight break-words">{fields.summary}</h1>
                  {fields.issuetype && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                      {fields.issuetype.name}
                    </span>
                  )}
                </div>
                
                {/* Description Section */}
                {description && (
                  <div className="w-full">
                    <h2 className="text-base font-semibold text-gray-900 mb-4">Description</h2>
                    <div 
                      className="text-sm text-gray-700 leading-relaxed prose prose-sm max-w-none prose-headings:font-semibold prose-p:my-2 prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded prose-pre:p-3 break-words overflow-wrap-anywhere"
                      style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}

                {/* Comments Section */}
                {displayIssue.comments && displayIssue.comments.length > 0 ? (
                  <div className="w-full">
                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaComments className="w-4 h-4 text-gray-500" />
                      Activity ({displayIssue.comments.length})
                    </h2>
                    <div className="space-y-6 w-full">
                      {displayIssue.comments.map((comment: Comment) => {
                        // Get comment body - prefer renderedBody (HTML) or parse document structure
                        const getCommentBody = (): string => {
                          if (comment.renderedBody) {
                            return comment.renderedBody;
                          }
                          if (typeof comment.body === "string") {
                            return comment.body;
                          }
                          return extractTextFromDocument(comment.body);
                        };
                        const commentBody = getCommentBody();
                        
                        return (
                          <div key={comment.id} className="border-l-2 border-gray-200 pl-4 w-full min-w-0">
                            <div className="flex items-start gap-3 min-w-0">
                              {comment.author.avatarUrls ? (
                                <img
                                  src={comment.author.avatarUrls["24x24"]}
                                  alt={comment.author.displayName}
                                  className="w-8 h-8 rounded-full flex-shrink-0 border-2 border-white shadow-sm"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                                  <FaUser className="w-4 h-4 text-gray-500" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="text-sm font-semibold text-gray-900 break-words">{comment.author.displayName}</span>
                                  <span className="text-xs text-gray-500 whitespace-nowrap">
                                    {new Date(comment.created).toLocaleString()}
                                  </span>
                                </div>
                                <div 
                                  className="text-sm text-gray-700 mt-1 prose prose-sm max-w-none prose-p:my-1 break-words overflow-wrap-anywhere"
                                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                                  dangerouslySetInnerHTML={{ __html: commentBody }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="w-full">
                    <h2 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FaComments className="w-4 h-4 text-gray-500" />
                      Activity (0)
                    </h2>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel - Metadata */}
          <div className="w-80 bg-gray-50 overflow-y-auto px-5 py-4 border-l border-gray-200">
            {!loading && (
              <div className="space-y-6">
                {/* Details Section */}
                <div>
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 pb-2 border-b-2">Details</h3>
                  <div className="space-y-4">
                    {/* Assignee */}
                    {fields.assignee && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <FaUser className="w-3.5 h-3.5" />
                          Assignee
                        </div>
                        <div className="flex items-center gap-2.5">
                          {fields.assignee.avatarUrls ? (
                            <img
                              src={fields.assignee.avatarUrls["24x24"]}
                              alt={fields.assignee.displayName}
                              className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                              <FaUser className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">{fields.assignee.displayName}</span>
                        </div>
                      </div>
                    )}

                    {/* Reporter */}
                    {fields.reporter && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <FaUserCircle className="w-3.5 h-3.5" />
                          Reporter
                        </div>
                        <div className="flex items-center gap-2.5">
                          {fields.reporter.avatarUrls ? (
                            <img
                              src={fields.reporter.avatarUrls["24x24"]}
                              alt={fields.reporter.displayName}
                              className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center">
                              <FaUserCircle className="w-3.5 h-3.5 text-gray-600" />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-900">{fields.reporter.displayName}</span>
                        </div>
                      </div>
                    )}

                    {/* Priority */}
                    {fields.priority && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <FaFlag className="w-3.5 h-3.5" />
                          Priority
                        </div>
                        <div className="flex">
                          <div className={`text-[10px] px-2 py-1 rounded border font-semibold ${priorityColor}`}>
                            {fields.priority.name}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Issue Type */}
                    {fields.issuetype && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <FaTag className="w-3.5 h-3.5" />
                          Issue Type
                        </div>
                        <div className="text-sm font-medium text-gray-900">{fields.issuetype.name}</div>
                      </div>
                    )}

                    {/* Created Date */}
                    {fields.created && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <FaCalendar className="w-3.5 h-3.5" />
                          Created
                        </div>
                        <div className="text-sm font-medium text-gray-900">{new Date(fields.created).toLocaleDateString()}</div>
                      </div>
                    )}

                    {/* Updated Date */}
                    {fields.updated && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <FaCalendar className="w-3.5 h-3.5" />
                          Last Updated
                        </div>
                        <div className="text-sm font-medium text-gray-900">{new Date(fields.updated).toLocaleDateString()}</div>
                      </div>
                    )}

                    {/* Time Tracking */}
                    {fields.timetracking && (
                      <div>
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                          <FaClock className="w-3.5 h-3.5" />
                          Time Tracking
                        </div>
                        <div className="space-y-1.5 text-sm text-gray-900 bg-white rounded-md p-3 border border-gray-200">
                          {fields.timetracking.originalEstimate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Estimate:</span>
                              <span className="font-medium">{fields.timetracking.originalEstimate}</span>
                            </div>
                          )}
                          {fields.timetracking.timeSpent && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Spent:</span>
                              <span className="font-medium">{fields.timetracking.timeSpent}</span>
                            </div>
                          )}
                          {fields.timetracking.remainingEstimate && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">Remaining:</span>
                              <span className="font-medium">{fields.timetracking.remainingEstimate}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default TicketModal;

