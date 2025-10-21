import React from "react";
import Column from "./Column";
import { BoardProps, Issue } from "../interfaces";

const Board = ({ columns, issues }: BoardProps) => {
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
};

export default Board;

