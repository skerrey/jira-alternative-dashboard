const express = require("express");
const axios = require("axios");
const router = express.Router();

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
  try {
    const response = await jiraClient.get(`/rest/api/3/project/${process.env.JIRA_PROJECT_KEY}/statuses`);
    const statuses = response.data[0]?.statuses || [];
    
    // Define custom column order mapping
    const columnOrderMap = {
      "to do": 0,
      "analysis": 1,
      "selected for dev": 2,
      "in dev": 3,
      "unit testing": 4,
      "sit": 5,
      "uat": 6,
      "ready for deploy": 7,
      "done": 8
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
    console.error("Error fetching columns:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch columns" });
  }
});

// Get all issues
router.get("/issues", async (req, res) => {
  try {
    const { assignee, search } = req.query;
    
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
    console.error("Error fetching issues:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch issues" });
  }
});

// Get users in project
router.get("/users", async (req, res) => {
  try {
    const response = await jiraClient.get(`/rest/api/3/user/assignable/search`, {
      params: {
        project: process.env.JIRA_PROJECT_KEY,
        maxResults: 50
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching users:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

module.exports = router;

