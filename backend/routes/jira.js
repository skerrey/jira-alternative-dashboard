const express = require('express');
const axios = require('axios');
const router = express.Router();

const jiraClient = axios.create({
  baseURL: process.env.JIRA_BASE_URL,
  auth: {
    username: process.env.JIRA_EMAIL,
    password: process.env.JIRA_API_TOKEN
  },
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Get board columns (statuses)
router.get('/columns', async (req, res) => {
  try {
    const response = await jiraClient.get(`/rest/api/3/project/${process.env.JIRA_PROJECT_KEY}/statuses`);
    const statuses = response.data[0]?.statuses || [];
    res.json(statuses);
  } catch (error) {
    console.error('Error fetching columns:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch columns' });
  }
});

// Get all issues
router.get('/issues', async (req, res) => {
  try {
    const { assignee, search } = req.query;
    
    let jql = `project = ${process.env.JIRA_PROJECT_KEY}`;
    
    if (assignee && assignee !== 'all') {
      jql += ` AND assignee = ${assignee}`;
    }
    
    if (search) {
      jql += ` AND (summary ~ "${search}" OR description ~ "${search}")`;
    }
    
    jql += ' ORDER BY created DESC';
    
    const response = await jiraClient.post('/rest/api/3/search/jql', {
      jql: jql,
      maxResults: 100,
      fields: ['summary', 'status', 'assignee', 'priority', 'issuetype', 'created', 'updated']
    });
    
    res.json(response.data.issues);
  } catch (error) {
    console.error('Error fetching issues:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch issues' });
  }
});

// Get users in project
router.get('/users', async (req, res) => {
  try {
    const response = await jiraClient.get(`/rest/api/3/user/assignable/search`, {
      params: {
        project: process.env.JIRA_PROJECT_KEY,
        maxResults: 50
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching users:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;

