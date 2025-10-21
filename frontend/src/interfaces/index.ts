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
  fields: {
    summary: string;
    status: {
      name: string;
    };
    assignee?: {
      displayName: string;
      avatarUrls?: {
        "24x24": string;
      };
    };
    priority?: {
      name: string;
    };
    issuetype?: {
      name: string;
    };
  };
}

export interface BoardProps {
  columns: Column[];
  issues: Issue[];
}

export interface ColumnProps {
  column: Column;
  issues: Issue[];
}

export interface TicketProps {
  issue: Issue;
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

