export interface Column {
  id: string;
  name: string;
}

export interface User {
  accountId: string;
  displayName: string;
}

export interface Issue {
  id: string;
  key: string;
  renderedFields?: {
    description?: string;
  };
  fields: {
    summary: string;
    description?: string | {
      type: string;
      version: number;
      content: any[];
    };
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
      accountId: string;
      avatarUrls?: {
        "24x24": string;
        "48x48": string;
      };
    };
    priority?: {
      name: string;
    };
    issuetype?: {
      name: string;
    };
    created?: string;
    updated?: string;
    timetracking?: {
      originalEstimate?: string;
      remainingEstimate?: string;
      timeSpent?: string;
      originalEstimateSeconds?: number;
      remainingEstimateSeconds?: number;
      timeSpentSeconds?: number;
    };
    creator?: {
      displayName: string;
      avatarUrls?: {
        "24x24": string;
      };
    };
    reporter?: {
      displayName: string;
      avatarUrls?: {
        "24x24": string;
      };
    };
  };
  comments?: Comment[];
  worklog?: Worklog;
}

export interface Comment {
  id: string;
  author: {
    displayName: string;
    avatarUrls?: {
      "24x24": string;
      "48x48": string;
    };
  };
  body: string | {
    type: string;
    version: number;
    content: any[];
  };
  renderedBody?: string;
  created: string;
  updated?: string;
}

export interface Worklog {
  total: number;
  worklogs: WorklogEntry[];
}

export interface WorklogEntry {
  id: string;
  author: {
    displayName: string;
    avatarUrls?: {
      "24x24": string;
    };
  };
  comment?: string | {
    type: string;
    version: number;
    content: any[];
  };
  renderedComment?: string;
  timeSpent: string;
  timeSpentSeconds: number;
  started: string;
  created: string;
  updated?: string;
}

export interface BoardProps {
  columns: Column[];
  issues: Issue[];
  onTicketClick: (issue: Issue) => void;
  highlightedTicketKey?: string | null;
}

export interface ColumnProps {
  column: Column;
  issues: Issue[];
  onTicketClick: (issue: Issue) => void;
  highlightedTicketKey?: string | null;
}

export interface TicketProps {
  issue: Issue;
  onClick: () => void;
  isHighlighted?: boolean;
}

export interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export interface UserFilterProps {
  users: User[];
  selectedUser: string;
  setSelectedUser: (userId: string) => void;
}

export interface TicketModalProps {
  issue: Issue | null;
  onClose: () => void;
}

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  source?: "preloaded" | "openai" | "ai-assisted" | "error";
  suggestions?: string[];
}

