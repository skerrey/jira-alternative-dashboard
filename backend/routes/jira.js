const express = require("express");
const axios = require("axios");
const router = express.Router();

// Import mock data and helpers
const mockColumns = require("../data/columns");
const mockUsers = require("../data/users");
const mockProjectName = require("../data/project");
const mockIssues = require("../data/issues");
const { mockIssueDetails, getDefaultIssueDetails } = require("../data/issueDetails");
const { isJiraAvailable, filterIssuesByAssignee, filterIssuesBySearch } = require("../data/helpers");

const jiraClient = axios.create({
  baseURL: process.env.JIRA_BASE_URL,
  auth: {
    username: process.env.JIRA_EMAIL,
    password: process.env.JIRA_API_TOKEN
  },
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

// Get board columns (statuses)
router.get("/columns", async (req, res) => {
  // Check if Jira is available, if not use mock data
  if (!isJiraAvailable()) {
    console.log("Jira not configured, using mock data for columns");
    return res.json(mockColumns);
  }

  try {
    const response = await jiraClient.get(`/rest/api/3/project/${process.env.JIRA_PROJECT_KEY}/statuses`);
    const statuses = response.data[0]?.statuses || [];
    
    // Define custom column order mapping
    const columnOrderMap = {
      "to do": 0,
      "in dev": 1,
      "testing": 2,
      "uat": 3,
      "ready for deploy": 4,
      "done": 5
    };
    
    // Sort statuses based on custom order
    const sortedStatuses = statuses.sort((a, b) => {
      const aOrder = columnOrderMap[a.name.toLowerCase()];
      const bOrder = columnOrderMap[b.name.toLowerCase()];
      
      // If both are in the order map, sort by their position
      if (aOrder !== undefined && bOrder !== undefined) {
        return aOrder - bOrder;
      }
      // If only a is in the order map, it comes first
      if (aOrder !== undefined) return -1;
      // If only b is in the order map, it comes first
      if (bOrder !== undefined) return 1;
      // If neither is in the order map, maintain original order
      return 0;
    });
    
    res.json(sortedStatuses);
  } catch (error) {
    console.error("Error fetching columns, using mock data:", error.response?.data || error.message);
    res.json(mockColumns);
  }
});

// Get all issues
router.get("/issues", async (req, res) => {
  const { assignee, search } = req.query;
  
  // Check if Jira is available, if not use mock data
  if (!isJiraAvailable()) {
    console.log("Jira not configured, using mock data for issues");
    let filteredIssues = [...mockIssues];
    
    // Apply filters
    filteredIssues = filterIssuesByAssignee(filteredIssues, assignee);
    filteredIssues = filterIssuesBySearch(filteredIssues, search);
    
    // Sort by created date descending
    filteredIssues.sort((a, b) => {
      const dateA = new Date(a.fields.created || 0);
      const dateB = new Date(b.fields.created || 0);
      return dateB - dateA;
    });
    
    return res.json(filteredIssues);
  }

  try {
    let jql = `project = ${process.env.JIRA_PROJECT_KEY}`;
    
    if (assignee && assignee !== "all") {
      jql += ` AND assignee = ${assignee}`;
    }
    
    if (search) {
      jql += ` AND (summary ~ "${search}" OR description ~ "${search}")`;
    }
    
    jql += " ORDER BY created DESC";
    
    const response = await jiraClient.post("/rest/api/3/search/jql", {
      jql: jql,
      maxResults: 100,
      fields: ["summary", "status", "assignee", "priority", "issuetype", "created", "updated"]
    });
    
    res.json(response.data.issues);
  } catch (error) {
    console.error("Error fetching issues, using mock data:", error.response?.data || error.message);
    let filteredIssues = [...mockIssues];
    
    // Apply filters
    filteredIssues = filterIssuesByAssignee(filteredIssues, assignee);
    filteredIssues = filterIssuesBySearch(filteredIssues, search);
    
    // Sort by created date descending
    filteredIssues.sort((a, b) => {
      const dateA = new Date(a.fields.created || 0);
      const dateB = new Date(b.fields.created || 0);
      return dateB - dateA;
    });
    
    res.json(filteredIssues);
  }
});

// Get users in project
router.get("/users", async (req, res) => {
  // Check if Jira is available, if not use mock data
  if (!isJiraAvailable()) {
    console.log("Jira not configured, using mock data for users");
    return res.json(mockUsers);
  }

  try {
    const response = await jiraClient.get(`/rest/api/3/user/assignable/search`, {
      params: {
        project: process.env.JIRA_PROJECT_KEY,
        maxResults: 50
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching users, using mock data:", error.response?.data || error.message);
    res.json(mockUsers);
  }
});

// Get project name
router.get("/project", async (req, res) => {
  // Check if Jira is available, if not use mock data
  if (!isJiraAvailable()) {
    console.log("Jira not configured, using mock data for project name");
    return res.json(mockProjectName);
  }

  try {
    const response = await jiraClient.get(`/rest/api/3/project/${process.env.JIRA_PROJECT_KEY}`);
    res.json(response.data.name);
  } catch (error) {
    console.error("Error fetching project name, using mock data:", error.response?.data || error.message);
    res.json(mockProjectName);
  }
});

// Get single issue with full details
router.get("/issue/:issueKey", async (req, res) => {
  const { issueKey } = req.params;
  
  // Check if Jira is available, if not use mock data
  if (!isJiraAvailable()) {
    console.log(`Jira not configured, using mock data for issue ${issueKey}`);
    const issueDetail = mockIssueDetails[issueKey] || getDefaultIssueDetails(issueKey);
    
    if (!issueDetail) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    return res.json(issueDetail);
  }

  try {
    // Request fields as comma-separated string (Jira API format)
    const fieldsParam = "summary,description,status,assignee,priority,issuetype,created,updated,timetracking,creator,reporter";
    
    const response = await jiraClient.get(`/rest/api/3/issue/${issueKey}`, {
      params: {
        expand: "renderedFields",
        fields: fieldsParam
      }
    });
    
    const issue = response.data;
    
    // Log the issue structure for debugging
    console.log("Issue response structure:", JSON.stringify(issue, null, 2));
    
    // Get comments with rendered body
    let comments = [];
    try {
      const commentsResponse = await jiraClient.get(`/rest/api/3/issue/${issueKey}/comment`, {
        params: {
          expand: "renderedBody"
        }
      });
      comments = commentsResponse.data.comments || [];
      console.log("Comments count:", comments.length);
    } catch (commentError) {
      console.error("Error fetching comments:", commentError.message);
    }
    
    // Get worklog (time tracking) with rendered comments
    let worklog = null;
    try {
      const worklogResponse = await jiraClient.get(`/rest/api/3/issue/${issueKey}/worklog`, {
        params: {
          expand: "renderedFields"
        }
      });
      worklog = worklogResponse.data;
      console.log("Worklog entries:", worklog?.worklogs?.length || 0);
    } catch (worklogError) {
      console.error("Error fetching worklog:", worklogError.message);
    }
    
    // Format the response with all details
    const issueDetails = {
      ...issue,
      comments: comments,
      worklog: worklog
    };
    
    res.json(issueDetails);
  } catch (error) {
    console.error("Error fetching issue details, using mock data:", error.response?.data || error.message);
    
    // Fallback to mock data
    const issueDetail = mockIssueDetails[issueKey] || getDefaultIssueDetails(issueKey);
    
    if (!issueDetail) {
      return res.status(404).json({ error: "Issue not found" });
    }
    
    res.json(issueDetail);
  }
});

module.exports = router;

