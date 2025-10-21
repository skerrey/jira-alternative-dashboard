import React from 'react';
import Ticket from './Ticket';
import './Column.css';

function Column({ column, issues }) {
  return (
    <div className="column">
      <div className="column-header">
        <h3>{column.name}</h3>
        <span className="issue-count">{issues.length}</span>
      </div>
      <div className="column-content">
        {issues.map(issue => (
          <Ticket key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
}

export default Column;

