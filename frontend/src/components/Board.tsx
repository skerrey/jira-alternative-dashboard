import React from "react";
import Column from "./Column";

interface Issue {
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

interface Column {
  id: string;
  name: string;
}

interface BoardProps {
  columns: Column[];
  issues: Issue[];
}

function Board({ columns, issues }: BoardProps) {
  const getIssuesByStatus = (statusName: string): Issue[] => {
    return issues.filter(issue => issue.fields.status.name === statusName);
  };

  return (
    <div className="flex gap-4 px-5 overflow-x-auto flex-1">
      {columns.map(column => (
        <Column 
          key={column.id} 
          column={column} 
          issues={getIssuesByStatus(column.name)} 
        />
      ))}
    </div>
  );
}

export default Board;

