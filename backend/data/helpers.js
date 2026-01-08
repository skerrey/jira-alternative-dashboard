// Helper function to check if Jira connection is available
const isJiraAvailable = () => {
  return !!(
    process.env.JIRA_BASE_URL &&
    process.env.JIRA_EMAIL &&
    process.env.JIRA_API_TOKEN &&
    process.env.JIRA_PROJECT_KEY
  );
};

// Helper function to filter issues by assignee
const filterIssuesByAssignee = (issues, assignee) => {
  if (!assignee || assignee === "all") {
    return issues;
  }
  return issues.filter(issue => 
    issue.fields.assignee?.accountId === assignee
  );
};

// Helper function to filter issues by search query
const filterIssuesBySearch = (issues, search) => {
  if (!search) {
    return issues;
  }
  const searchLower = search.toLowerCase();
  return issues.filter(issue => {
    const summary = issue.fields.summary?.toLowerCase() || "";
    const description = typeof issue.fields.description === "string" 
      ? issue.fields.description.toLowerCase()
      : "";
    return summary.includes(searchLower) || description.includes(searchLower);
  });
};

module.exports = {
  isJiraAvailable,
  filterIssuesByAssignee,
  filterIssuesBySearch
};

