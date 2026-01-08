// Preloaded responses database for AI Assistant
// Organized by category with keyword triggers

const assistantResponses = [
  // ============================================
  // GREETINGS & GENERAL HELP
  // ============================================
  {
    id: "greeting-1",
    category: "greeting",
    keywords: ["hello", "hi", "hey", "greetings"],
    priority: 100,
    response: () => "Hello! I'm your AI assistant for this project dashboard. I can help you find information about issues, team members, project status, and more. How can I help you today?"
  },
  {
    id: "greeting-2",
    category: "greeting",
    keywords: ["help", "what can you do", "capabilities", "what do you know"],
    priority: 100,
    response: () => "I can help you with:\n• Finding and searching for issues/tickets\n• Getting information about project status and workflows\n• Looking up team member assignments\n• Understanding project terminology and features\n• Answering questions about time tracking and estimates\n• Navigating the dashboard\n\nJust ask me anything about your project!"
  },
  {
    id: "greeting-3",
    category: "greeting",
    keywords: ["thanks", "thank you", "appreciate"],
    priority: 90,
    response: () => "You're welcome! Is there anything else I can help you with?"
  },

  // ============================================
  // PROJECT OVERVIEW
  // ============================================
  {
    id: "project-1",
    category: "project",
    keywords: ["project", "overview", "summary", "project summary"],
    priority: 90,
    response: (data) => {
      const totalIssues = data.issues?.length || 0;
      const todoCount = data.issues?.filter(i => i.fields?.status?.name === "To Do").length || 0;
      const inProgressCount = data.issues?.filter(i => i.fields?.status?.name === "In Dev").length || 0;
      const doneCount = data.issues?.filter(i => i.fields?.status?.name === "Done").length || 0;
      return `Here's an overview of your project:\n\n• Total Issues: ${totalIssues}\n• To Do: ${todoCount}\n• In Progress: ${inProgressCount}\n• Done: ${doneCount}\n\nThe project name is "${data.projectName || "Sample Project"}". Would you like more details about any specific aspect?`;
    }
  },
  {
    id: "project-2",
    category: "project",
    keywords: ["stats", "statistics", "how many", "count"],
    priority: 85,
    response: (data) => {
      const totalIssues = data.issues?.length || 0;
      const highPriority = data.issues?.filter(i => i.fields?.priority?.name === "High" || i.fields?.priority?.name === "Highest" || i.fields?.priority?.name === "Critical").length || 0;
      const bugs = data.issues?.filter(i => i.fields?.issuetype?.name === "Bug").length || 0;
      const stories = data.issues?.filter(i => i.fields?.issuetype?.name === "Story").length || 0;
      return `Project Statistics:\n• Total Issues: ${totalIssues}\n• High/Critical Priority: ${highPriority}\n• Bugs: ${bugs}\n• Stories: ${stories}\n• Team Members: ${data.users?.length || 0}`;
    }
  },

  // ============================================
  // ISSUE QUERIES - GENERAL
  // ============================================
  {
    id: "issue-1",
    category: "issue",
    keywords: ["issue", "ticket", "task", "what issues", "list issues"],
    priority: 90,
    response: (data) => {
      const totalIssues = data.issues?.length || 0;
      if (totalIssues === 0) return "There are currently no issues in the project.";
      return `There are ${totalIssues} issues in the project. You can filter them by status, assignee, or search by keywords. Would you like to know about a specific issue or see issues by status/priority?`;
    }
  },
  {
    id: "issue-2",
    category: "issue",
    keywords: ["bug", "bugs", "what bugs", "list bugs"],
    priority: 85,
    response: (data) => {
      const bugs = data.issues?.filter(i => i.fields?.issuetype?.name === "Bug") || [];
      if (bugs.length === 0) return "There are currently no bugs reported.";
      const bugList = bugs.slice(0, 5).map(b => `• ${b.key}: ${b.fields?.summary}`).join("\n");
      return `Found ${bugs.length} bug(s):\n\n${bugList}${bugs.length > 5 ? `\n\n...and ${bugs.length - 5} more.` : ""}`;
    }
  },
  {
    id: "issue-3",
    category: "issue",
    keywords: ["story", "stories", "user story", "user stories"],
    priority: 85,
    response: (data) => {
      const stories = data.issues?.filter(i => i.fields?.issuetype?.name === "Story") || [];
      if (stories.length === 0) return "There are currently no user stories.";
      const storyList = stories.slice(0, 5).map(s => `• ${s.key}: ${s.fields?.summary}`).join("\n");
      return `Found ${stories.length} user story/stories:\n\n${storyList}${stories.length > 5 ? `\n\n...and ${stories.length - 5} more.` : ""}`;
    }
  },

  // ============================================
  // ISSUE QUERIES - STATUS
  // ============================================
  {
    id: "status-1",
    category: "status",
    keywords: ["status", "what status", "current status", "stage", "column"],
    priority: 85,
    response: (data) => {
      const columns = data.columns || [];
      if (columns.length === 0) return "No status columns available.";
      const columnList = columns.map(c => `• ${c.name}`).join("\n");
      return `Available status columns:\n\n${columnList}\n\nYou can ask about issues in a specific status, like "what issues are in To Do?"`;
    }
  },
  {
    id: "status-2",
    category: "status",
    keywords: ["to do", "todo", "what's in to do"],
    priority: 80,
    response: (data) => {
      const todoIssues = data.issues?.filter(i => i.fields?.status?.name === "To Do") || [];
      if (todoIssues.length === 0) return "There are no issues in 'To Do' status.";
      const issueList = todoIssues.slice(0, 5).map(i => `• ${i.key}: ${i.fields?.summary}`).join("\n");
      return `Issues in 'To Do' status (${todoIssues.length}):\n\n${issueList}${todoIssues.length > 5 ? `\n\n...and ${todoIssues.length - 5} more.` : ""}`;
    }
  },
  {
    id: "status-3",
    category: "status",
    keywords: ["in progress", "in dev", "development", "what's being worked on"],
    priority: 80,
    response: (data) => {
      const inDevIssues = data.issues?.filter(i => i.fields?.status?.name === "In Dev") || [];
      if (inDevIssues.length === 0) return "There are no issues currently in development.";
      const issueList = inDevIssues.map(i => `• ${i.key}: ${i.fields?.summary} (${i.fields?.assignee?.displayName || "Unassigned"})`).join("\n");
      return `Issues currently in development (${inDevIssues.length}):\n\n${issueList}`;
    }
  },
  {
    id: "status-4",
    category: "status",
    keywords: ["done", "completed", "finished", "what's done"],
    priority: 80,
    response: (data) => {
      const doneIssues = data.issues?.filter(i => i.fields?.status?.name === "Done") || [];
      if (doneIssues.length === 0) return "No issues have been completed yet.";
      const issueList = doneIssues.slice(0, 5).map(i => `• ${i.key}: ${i.fields?.summary}`).join("\n");
      return `Completed issues (${doneIssues.length}):\n\n${issueList}${doneIssues.length > 5 ? `\n\n...and ${doneIssues.length - 5} more.` : ""}`;
    }
  },
  {
    id: "status-5",
    category: "status",
    keywords: ["testing", "in testing", "what's in testing"],
    priority: 80,
    response: (data) => {
      const testingIssues = data.issues?.filter(i => i.fields?.status?.name === "Testing") || [];
      if (testingIssues.length === 0) return "There are no issues currently in testing.";
      const issueList = testingIssues.map(i => `• ${i.key}: ${i.fields?.summary}`).join("\n");
      return `Issues in testing (${testingIssues.length}):\n\n${issueList}`;
    }
  },

  // ============================================
  // ISSUE QUERIES - ASSIGNEE
  // ============================================
  {
    id: "assignee-1",
    category: "assignee",
    keywords: ["who", "assignee", "assigned to", "who is working on", "assigned"],
    priority: 85,
    response: (data, query) => {
      // Try to extract issue key from query (e.g., "PROJ-1")
      const issueKeyMatch = query.match(/(PROJ-\d+)/i);
      if (issueKeyMatch) {
        const issueKey = issueKeyMatch[1].toUpperCase();
        const issue = data.issues?.find(i => i.key === issueKey);
        if (issue) {
          const assignee = issue.fields?.assignee;
          return assignee 
            ? `${issueKey} "${issue.fields?.summary}" is assigned to ${assignee.displayName}.`
            : `${issueKey} "${issue.fields?.summary}" is currently unassigned.`;
        }
        return `I couldn't find issue ${issueKey}. Please check the issue key and try again.`;
      }
      
      // If no specific issue, show all assignments
      const assignedIssues = data.issues?.filter(i => i.fields?.assignee) || [];
      if (assignedIssues.length === 0) return "No issues are currently assigned.";
      
      const grouped = {};
      assignedIssues.forEach(i => {
        const name = i.fields.assignee.displayName;
        if (!grouped[name]) grouped[name] = [];
        grouped[name].push(i);
      });
      
      const result = Object.entries(grouped)
        .map(([name, issues]) => `\n${name} (${issues.length}):\n${issues.map(i => `  • ${i.key}: ${i.fields.summary}`).join("\n")}`)
        .join("\n");
      
      return `Current assignments:${result}`;
    }
  },
  {
    id: "assignee-2",
    category: "assignee",
    keywords: ["unassigned", "no assignee", "not assigned"],
    priority: 80,
    response: (data) => {
      const unassigned = data.issues?.filter(i => !i.fields?.assignee) || [];
      if (unassigned.length === 0) return "All issues are currently assigned.";
      const issueList = unassigned.map(i => `• ${i.key}: ${i.fields?.summary}`).join("\n");
      return `Unassigned issues (${unassigned.length}):\n\n${issueList}`;
    }
  },

  // ============================================
  // ISSUE QUERIES - PRIORITY
  // ============================================
  {
    id: "priority-1",
    category: "priority",
    keywords: ["priority", "priorities", "high priority", "urgent", "important"],
    priority: 85,
    response: (data) => {
      const highPriority = data.issues?.filter(i => {
        const p = i.fields?.priority?.name;
        return p === "High" || p === "Highest" || p === "Critical";
      }) || [];
      
      if (highPriority.length === 0) return "There are no high priority issues.";
      
      const issueList = highPriority.map(i => {
        const priority = i.fields.priority.name;
        return `• ${i.key}: ${i.fields.summary} (${priority})`;
      }).join("\n");
      
      return `High priority issues (${highPriority.length}):\n\n${issueList}`;
    }
  },
  {
    id: "priority-2",
    category: "priority",
    keywords: ["critical", "critical issues"],
    priority: 90,
    response: (data) => {
      const critical = data.issues?.filter(i => i.fields?.priority?.name === "Critical") || [];
      if (critical.length === 0) return "There are no critical priority issues.";
      const issueList = critical.map(i => `• ${i.key}: ${i.fields.summary}`).join("\n");
      return `Critical issues (${critical.length}):\n\n${issueList}`;
    }
  },

  // ============================================
  // ISSUE QUERIES - SEARCH
  // ============================================
  {
    id: "search-1",
    category: "search",
    keywords: ["find", "search", "look for", "where is"],
    priority: 85,
    response: (data, query) => {
      // Extract search term from query
      const searchTerms = query.toLowerCase()
        .replace(/\b(find|search|look for|where is)\b/gi, "")
        .trim()
        .split(/\s+/);
      
      if (searchTerms.length === 0 || searchTerms[0] === "") {
        return "What would you like to search for? Please specify, for example: 'find authentication' or 'search for login'.";
      }
      
      const matches = data.issues?.filter(i => {
        const summary = (i.fields?.summary || "").toLowerCase();
        const description = typeof i.fields?.description === "string" 
          ? i.fields.description.toLowerCase()
          : "";
        return searchTerms.some(term => summary.includes(term) || description.includes(term));
      }) || [];
      
      if (matches.length === 0) {
        return `I couldn't find any issues matching "${searchTerms.join(" ")}". Try different keywords.`;
      }
      
      const issueList = matches.slice(0, 5).map(i => 
        `• ${i.key}: ${i.fields.summary} (${i.fields.status.name})`
      ).join("\n");
      
      return `Found ${matches.length} matching issue(s):\n\n${issueList}${matches.length > 5 ? `\n\n...and ${matches.length - 5} more.` : ""}`;
    }
  },

  // ============================================
  // WORKFLOW / COLUMNS
  // ============================================
  {
    id: "workflow-1",
    category: "workflow",
    keywords: ["workflow", "columns", "stages", "statuses", "what are the columns"],
    priority: 90,
    response: (data) => {
      const columns = data.columns || [];
      if (columns.length === 0) return "No workflow columns available.";
      
      const descriptions = {
        "To Do": "Issues that haven't been started yet",
        "In Dev": "Issues currently being worked on",
        "Testing": "Issues being tested",
        "UAT": "User Acceptance Testing - ready for client/stakeholder review",
        "Ready for Deploy": "Issues approved and ready for deployment",
        "Done": "Issues that have been completed"
      };
      
      const columnList = columns.map(c => {
        const desc = descriptions[c.name] || "Workflow stage";
        return `• ${c.name}: ${desc}`;
      }).join("\n");
      
      return `Project Workflow Columns:\n\n${columnList}`;
    }
  },

  // ============================================
  // USER / TEAM QUERIES
  // ============================================
  {
    id: "user-1",
    category: "user",
    keywords: ["users", "team", "team members", "who is on the team"],
    priority: 85,
    response: (data) => {
      const users = data.users || [];
      if (users.length === 0) return "No team members found.";
      
      const userList = users.map(u => {
        const assignedCount = data.issues?.filter(i => i.fields?.assignee?.accountId === u.accountId).length || 0;
        return `• ${u.displayName} (${assignedCount} assigned issue${assignedCount !== 1 ? "s" : ""})`;
      }).join("\n");
      
      return `Team Members (${users.length}):\n\n${userList}`;
    }
  },
  {
    id: "user-2",
    category: "user",
    keywords: ["what is", "working on", "what are they working on"],
    priority: 80,
    response: (data, query) => {
      // Try to extract user name from query
      const users = data.users || [];
      const userNameMatch = query.match(/\b(John|Sarah|Mike|Emily|David|Smith|Johnson|Chen|Davis|Wilson)\b/i);
      
      if (userNameMatch) {
        const searchName = userNameMatch[0];
        const user = users.find(u => 
          u.displayName.toLowerCase().includes(searchName.toLowerCase())
        );
        
        if (user) {
          const userIssues = data.issues?.filter(i => 
            i.fields?.assignee?.accountId === user.accountId
          ) || [];
          
          if (userIssues.length === 0) {
            return `${user.displayName} doesn't have any assigned issues at the moment.`;
          }
          
          const issueList = userIssues.map(i => 
            `• ${i.key}: ${i.fields.summary} (${i.fields.status.name})`
          ).join("\n");
          
          return `${user.displayName} is working on:\n\n${issueList}`;
        }
      }
      
      return "Which team member would you like to know about? Please specify a name.";
    }
  },

  // ============================================
  // TIME TRACKING
  // ============================================
  {
    id: "time-1",
    category: "time",
    keywords: ["time", "hours", "time tracking", "how much time"],
    priority: 80,
    response: (data) => {
      const issuesWithTime = data.issues?.filter(i => 
        i.fields?.timetracking?.timeSpent || 
        i.renderedFields?.description?.includes("time")
      ) || [];
      
      if (issuesWithTime.length === 0) {
        return "Time tracking information is available in issue details. You can open any issue to see estimated time, time spent, and remaining time.";
      }
      
      return "Time tracking shows estimated time, time spent, and remaining time for each issue. Open an issue to see detailed time tracking information.";
    }
  },

  // ============================================
  // NAVIGATION HELP
  // ============================================
  {
    id: "nav-1",
    category: "navigation",
    keywords: ["how to", "how do i", "how can i"],
    priority: 85,
    response: () => "Here are some things you can do:\n\n• Click on any issue card to see details\n• Use the search bar to find specific issues\n• Filter by team member using the user filter\n• Ask me questions about the project\n• Click on an issue to see comments, time tracking, and full details\n\nWhat would you like to do?"
  },
  {
    id: "nav-2",
    category: "navigation",
    keywords: ["filter", "how to filter", "filter issues"],
    priority: 80,
    response: () => "You can filter issues in two ways:\n\n1. **By Team Member**: Use the user filter dropdown at the top to see issues assigned to a specific person\n2. **By Search**: Type keywords in the search bar to find issues matching your terms\n\nYou can also ask me to filter or find issues for you!"
  },

  // ============================================
  // TECHNICAL / TERMINOLOGY
  // ============================================
  {
    id: "tech-1",
    category: "technical",
    keywords: ["what is", "explain", "tell me about", "what does"],
    priority: 75,
    response: (data, query) => {
      const lowerQuery = query.toLowerCase();
      
      if (lowerQuery.includes("jira") || lowerQuery.includes("dashboard")) {
        return "This is a Jira dashboard alternative that helps you manage your project issues. It displays issues in columns based on their status, lets you search and filter, and provides detailed views of each issue.";
      }
      
      if (lowerQuery.includes("issue") || lowerQuery.includes("ticket")) {
        return "An issue (or ticket) represents a unit of work - it could be a bug to fix, a feature to implement, or a task to complete. Each issue has a status, priority, assignee, and other details.";
      }
      
      if (lowerQuery.includes("status") || lowerQuery.includes("column")) {
        return "Status (or column) represents the current stage of an issue in the workflow. Issues move through columns like 'To Do' → 'In Dev' → 'Testing' → 'Done'.";
      }
      
      if (lowerQuery.includes("priority")) {
        return "Priority indicates how urgent an issue is. Common priorities include: Critical, Highest, High, Medium, and Low.";
      }
      
      if (lowerQuery.includes("assignee")) {
        return "The assignee is the team member responsible for working on a specific issue. An issue can be assigned to one person or left unassigned.";
      }
      
      return "Could you be more specific? I can explain issues, statuses, priorities, assignees, workflows, and other project management terms.";
    }
  },

  // ============================================
  // FALLBACK / NO MATCH
  // ============================================
  {
    id: "fallback-1",
    category: "fallback",
    keywords: [], // No keywords - used as last resort
    priority: 0,
    response: () => ({
      text: "Hmm, I'm not quite sure how to help you with that.",
      suggestions: [
        "What issues are in progress?",
        "Show me project statistics",
        "Who is working on what?"
      ]
    })
  }
];

module.exports = assistantResponses;

