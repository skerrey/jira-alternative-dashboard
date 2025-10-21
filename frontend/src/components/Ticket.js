import React from 'react';
import './Ticket.css';

function Ticket({ issue }) {
  const { fields } = issue;
  
  return (
    <div className="ticket">
      <div className="ticket-header">
        <span className="ticket-key">{issue.key}</span>
        {fields.issuetype && (
          <span className="ticket-type">{fields.issuetype.name}</span>
        )}
      </div>
      <div className="ticket-summary">{fields.summary}</div>
      {fields.assignee && (
        <div className="ticket-assignee">
          {fields.assignee.avatarUrls && (
            <img 
              src={fields.assignee.avatarUrls['24x24']} 
              alt={fields.assignee.displayName}
              className="assignee-avatar"
            />
          )}
          <span className="assignee-name">{fields.assignee.displayName}</span>
        </div>
      )}
      {fields.priority && (
        <div className="ticket-priority">
          Priority: {fields.priority.name}
        </div>
      )}
    </div>
  );
}

export default Ticket;

