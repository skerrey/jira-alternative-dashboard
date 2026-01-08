// Mock issues data
const mockIssues = [
  {
    id: "10001",
    key: "PROJ-1",
    fields: {
      summary: "Implement user authentication system",
      status: { name: "In Dev" },
      assignee: {
        displayName: "John Smith",
        accountId: "user1",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=John+Smith&size=24&background=2563eb&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=John+Smith&size=48&background=2563eb&color=fff"
        }
      },
      priority: { name: "High" },
      issuetype: { name: "Story" },
      created: "2024-01-15T10:30:00.000Z",
      updated: "2024-01-20T14:20:00.000Z"
    }
  },
  {
    id: "10002",
    key: "PROJ-2",
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
      priority: { name: "Medium" },
      issuetype: { name: "Task" },
      created: "2024-01-16T09:15:00.000Z",
      updated: "2024-01-19T16:45:00.000Z"
    }
  },
  {
    id: "10003",
    key: "PROJ-3",
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
      priority: { name: "Low" },
      issuetype: { name: "Bug" },
      created: "2024-01-17T11:00:00.000Z",
      updated: "2024-01-21T10:30:00.000Z"
    }
  },
  {
    id: "10004",
    key: "PROJ-4",
    fields: {
      summary: "Add password reset functionality",
      status: { name: "To Do" },
      assignee: {
        displayName: "Emily Davis",
        accountId: "user4",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Emily+Davis&size=24&background=059669&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=Emily+Davis&size=48&background=059669&color=fff"
        }
      },
      priority: { name: "High" },
      issuetype: { name: "Story" },
      created: "2024-01-18T08:20:00.000Z",
      updated: "2024-01-20T13:10:00.000Z"
    }
  },
  {
    id: "10005",
    key: "PROJ-5",
    fields: {
      summary: "Create API documentation",
      status: { name: "To Do" },
      assignee: {
        displayName: "David Wilson",
        accountId: "user5",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=David+Wilson&size=24&background=f59e0b&color=000",
          "48x48": "https://ui-avatars.com/api/?name=David+Wilson&size=48&background=f59e0b&color=000"
        }
      },
      priority: { name: "Medium" },
      issuetype: { name: "Task" },
      created: "2024-01-19T14:00:00.000Z",
      updated: "2024-01-19T14:00:00.000Z"
    }
  },
  {
    id: "10006",
    key: "PROJ-6",
    fields: {
      summary: "Optimize database queries for user search",
      status: { name: "Testing" },
      assignee: {
        displayName: "John Smith",
        accountId: "user1",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=John+Smith&size=24&background=2563eb&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=John+Smith&size=48&background=2563eb&color=fff"
        }
      },
      priority: { name: "Highest" },
      issuetype: { name: "Bug" },
      created: "2024-01-14T12:30:00.000Z",
      updated: "2024-01-22T09:15:00.000Z"
    }
  },
  {
    id: "10007",
    key: "PROJ-7",
    fields: {
      summary: "Implement email notification system",
      status: { name: "UAT" },
      assignee: {
        displayName: "Sarah Johnson",
        accountId: "user2",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=24&background=dc2626&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=48&background=dc2626&color=fff"
        }
      },
      priority: { name: "High" },
      issuetype: { name: "Story" },
      created: "2024-01-13T10:00:00.000Z",
      updated: "2024-01-23T11:20:00.000Z"
    }
  },
  {
    id: "10008",
    key: "PROJ-8",
    fields: {
      summary: "Add user profile picture upload feature",
      status: { name: "Ready for Deploy" },
      assignee: {
        displayName: "Mike Chen",
        accountId: "user3",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Mike+Chen&size=24&background=7c3aed&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=Mike+Chen&size=48&background=7c3aed&color=fff"
        }
      },
      priority: { name: "Medium" },
      issuetype: { name: "Task" },
      created: "2024-01-12T09:45:00.000Z",
      updated: "2024-01-24T15:30:00.000Z"
    }
  },
  {
    id: "10009",
    key: "PROJ-9",
    fields: {
      summary: "Fix memory leak in authentication middleware",
      status: { name: "Done" },
      assignee: {
        displayName: "Emily Davis",
        accountId: "user4",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Emily+Davis&size=24&background=059669&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=Emily+Davis&size=48&background=059669&color=fff"
        }
      },
      priority: { name: "Critical" },
      issuetype: { name: "Bug" },
      created: "2024-01-11T08:00:00.000Z",
      updated: "2024-01-25T10:00:00.000Z"
    }
  },
  {
    id: "10010",
    key: "PROJ-10",
    fields: {
      summary: "Implement two-factor authentication",
      status: { name: "In Dev" },
      assignee: {
        displayName: "David Wilson",
        accountId: "user5",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=David+Wilson&size=24&background=f59e0b&color=000",
          "48x48": "https://ui-avatars.com/api/?name=David+Wilson&size=48&background=f59e0b&color=000"
        }
      },
      priority: { name: "High" },
      issuetype: { name: "Story" },
      created: "2024-01-20T13:30:00.000Z",
      updated: "2024-01-22T16:45:00.000Z"
    }
  },
  {
    id: "10011",
    key: "PROJ-11",
    fields: {
      summary: "Update user dashboard UI components",
      status: { name: "To Do" },
      assignee: {
        displayName: "John Smith",
        accountId: "user1",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=John+Smith&size=24&background=2563eb&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=John+Smith&size=48&background=2563eb&color=fff"
        }
      },
      priority: { name: "Low" },
      issuetype: { name: "Task" },
      created: "2024-01-21T10:15:00.000Z",
      updated: "2024-01-21T10:15:00.000Z"
    }
  },
  {
    id: "10012",
    key: "PROJ-12",
    fields: {
      summary: "Add session timeout warning to users",
      status: { name: "To Do" },
      assignee: {
        displayName: "Sarah Johnson",
        accountId: "user2",
        avatarUrls: {
          "24x24": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=24&background=dc2626&color=fff",
          "48x48": "https://ui-avatars.com/api/?name=Sarah+Johnson&size=48&background=dc2626&color=fff"
        }
      },
      priority: { name: "Medium" },
      issuetype: { name: "Story" },
      created: "2024-01-22T11:00:00.000Z",
      updated: "2024-01-23T14:20:00.000Z"
    }
  }
];

module.exports = mockIssues;

