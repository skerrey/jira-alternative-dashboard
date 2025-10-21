import React from 'react';
import Column from './Column';
import './Board.css';

function Board({ columns, issues }) {
  const getIssuesByStatus = (statusName) => {
    return issues.filter(issue => issue.fields.status.name === statusName);
  };

  return (
    <div className="board">
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

