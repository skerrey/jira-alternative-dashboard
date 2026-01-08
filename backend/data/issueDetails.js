// Mock issue details with comments
const mockIssueDetails = {
  "PROJ-1": {
    id: "10001",
    key: "PROJ-1",
    renderedFields: {
      description: "<p>This task involves implementing a complete user authentication system including:</p><ul><li>User registration</li><li>Login/logout functionality</li><li>Password hashing and validation</li><li>Session management</li></ul><p>We need to ensure security best practices are followed throughout the implementation.</p>"
    },
    fields: {
      summary: "Implement user authentication system",
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "This task involves implementing a complete user authentication system."
              }
            ]
          }
        ]
      },
      status: { name: "In Dev" },
      assignee: {
        displayName: "John Smith",
        accountId: "user1",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=John+Smith&size=24&background=2563eb&color=fffff",
          "48x48": "https://ui-avatars.com/api/?name=John+Smith&size=48&background=2563eb&color=fff"
        }
      },
      reporter: {
        displayName: "Sarah Johnson",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=24&background=dc2626&color=fff"
        }
      },
      priority: { name: "High" },
      issuetype: { name: "Story" },
      created: "2024-01-15T10:30:00.000Z",
      updated: "2024-01-20T14:20:00.000Z",
      timetracking: {
        originalEstimate: "3d",
        timeSpent: "1d 4h",
        remainingEstimate: "1d 4h",
        originalEstimateSeconds: 259200,
        timeSpentSeconds: 100800,
        remainingEstimateSeconds: 100800
      }
    },
    comments: [
      {
        id: "10001",
        author: {
          displayName: "John Smith",
          avatarUrls: {
            "24x24": "https://ui-avatars.com/api/?name=John+Smith&size=24&background=2563eb&color=fff",
            "48x48": "https://ui-avatars.com/api/?name=John+Smith&size=48&background=2563eb&color=fff"
          }
        },
        body: "Starting work on this. Will begin with the database schema design.",
        renderedBody: "<p>Starting work on this. Will begin with the database schema design.</p>",
        created: "2024-01-15T11:00:00.000Z"
      },
      {
        id: "10002",
        author: {
          displayName: "Sarah Johnson",
          avatarUrls: {
            "24x24": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=24&background=dc2626&color=fff",
            "48x48": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=48&background=dc2626&color=fff"
          }
        },
        body: "Make sure to use bcrypt for password hashing with at least 10 rounds.",
        renderedBody: "<p>Make sure to use bcrypt for password hashing with at least 10 rounds.</p>",
        created: "2024-01-16T09:30:00.000Z"
      },
      {
        id: "10003",
        author: {
          displayName: "John Smith",
          avatarUrls: {
            "24x24": "https://ui-avatars.com/api/?name=John+Smith&size=24&background=2563eb&color=fff",
            "48x48": "https://ui-avatars.com/api/?name=John+Smith&size=48&background=2563eb&color=fff"
          }
        },
        body: "Database schema is complete. Moving on to the API endpoints.",
        renderedBody: "<p>Database schema is complete. Moving on to the API endpoints.</p>",
        created: "2024-01-18T14:15:00.000Z"
      }
    ]
  },
  "PROJ-2": {
    id: "10002",
    key: "PROJ-2",
    renderedFields: {
      description: "<p>We need to design a comprehensive database schema that supports:</p><ul><li>User accounts and profiles</li><li>Role-based access control</li><li>Audit logging</li><li>Scalability for future growth</li></ul>"
    },
    fields: {
      summary: "Design database schema for user management",
      status: { name: "To Do" },
      assignee: {
        displayName: "Sarah Johnson",
        accountId: "user2",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=24&background=dc2626&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=48&background=dc2626&color=fff"
        }
      },
      reporter: {
        displayName: "Mike Chen",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Mike+Chen&size=24&background=7c3aed&color=fff"
        }
      },
      priority: { name: "Medium" },
      issuetype: { name: "Task" },
      created: "2024-01-16T09:15:00.000Z",
      updated: "2024-01-19T16:45:00.000Z",
      timetracking: {
        originalEstimate: "2d",
        timeSpent: "1d",
        remainingEstimate: "1d",
        originalEstimateSeconds: 172800,
        timeSpentSeconds: 86400,
        remainingEstimateSeconds: 86400
      }
    },
    comments: [
      {
        id: "10004",
        author: {
          displayName: "Sarah Johnson",
          avatarUrls: {
            "24x24": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=24&background=dc2626&color=fff",
            "48x48": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=48&background=dc2626&color=fff"
          }
        },
        body: "Reviewing existing database patterns and best practices.",
        renderedBody: "<p>Reviewing existing database patterns and best practices.</p>",
        created: "2024-01-16T10:00:00.000Z"
      }
    ]
  },
  "PROJ-3": {
    id: "10003",
    key: "PROJ-3",
    renderedFields: {
      description: "<p>The login button has incorrect styling that doesn't match the design system. Need to update CSS classes and ensure proper hover states.</p>"
    },
    fields: {
      summary: "Fix login button styling issue",
      status: { name: "Testing" },
      assignee: {
        displayName: "Mike Chen",
        accountId: "user3",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Mike+Chen&size=24&background=7c3aed&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=Mike+Chen&size=48&background=7c3aed&color=fff"
        }
      },
      reporter: {
        displayName: "Emily Davis",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Emily+Davis&size=24&background=059669&color=fff"
        }
      },
      priority: { name: "Low" },
      issuetype: { name: "Bug" },
      created: "2024-01-17T11:00:00.000Z",
      updated: "2024-01-21T10:30:00.000Z",
      timetracking: {
        originalEstimate: "2h",
        timeSpent: "1h 30m",
        remainingEstimate: "30m",
        originalEstimateSeconds: 7200,
        timeSpentSeconds: 5400,
        remainingEstimateSeconds: 1800
      }
    },
    comments: [
      {
        id: "10005",
        author: {
          displayName: "Mike Chen",
          avatarUrls: {
            "24x24": "https://ui-avatars.com/api/?name=Mike+Chen&size=24&background=7c3aed&color=fff",
            "48x48": "https://ui-avatars.com/api/?name=Mike+Chen&size=48&background=7c3aed&color=fff"
          }
        },
        body: "Fixed the styling. Running unit tests now.",
        renderedBody: "<p>Fixed the styling. Running unit tests now.</p>",
        created: "2024-01-20T15:00:00.000Z"
      }
    ]
  }
};

// Generate default issue details for any issue key not in the map
const getDefaultIssueDetails = (issueKey) => {
  const mockIssues = require("./issues");
  const issue = mockIssues.find(i => i.key === issueKey);
  if (!issue) return null;

  return {
    ...issue,
    renderedFields: {
      description: `<p>This is a detailed description for ${issue.fields.summary}.</p><p>Additional information and requirements will be documented here.</p>`
    },
    fields: {
      ...issue.fields,
      description: {
        type: "doc",
        version: 1,
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: `This is a detailed description for ${issue.fields.summary}.`
              }
            ]
          }
        ]
      },
      reporter: {
        displayName: "System Admin",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=System+Admin&size=24&background=475569&color=fff"
        }
      },
      timetracking: {
        originalEstimate: "1d",
        timeSpent: "4h",
        remainingEstimate: "4h",
        originalEstimateSeconds: 86400,
        timeSpentSeconds: 14400,
        remainingEstimateSeconds: 14400
      }
    },
    comments: [
      {
        id: `${issue.id}001`,
        author: {
          displayName: issue.fields.assignee?.displayName || "Unknown User",
          avatarUrls: issue.fields.assignee?.avatarUrls || {
            "24x24": "https://ui-avatars.com/api/?name=Unknown&size=24&background=6b7280&color=fff",
            "48x48": "https://ui-avatars.com/api/?name=Unknown&size=48&background=6b7280&color=fff"
          }
        },
        body: "Work in progress on this issue.",
        renderedBody: "<p>Work in progress on this issue.</p>",
        created: issue.fields.created || new Date().toISOString()
      }
    ]
  };
};

module.exports = { mockIssueDetails, getDefaultIssueDetails };

