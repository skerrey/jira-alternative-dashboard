import React from "react";
import { TicketProps } from "../interfaces";

const Ticket = ({ issue }: TicketProps) => {
  const { fields } = issue;
  
  return (
    <div className="bg-white rounded p-3 mb-2 shadow-sm cursor-pointer transition-shadow hover:shadow-md">
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs text-gray-600 font-semibold">{issue.key}</span>
        {fields.issuetype && (
          <span className="text-[11px] text-gray-600 bg-gray-200 px-1.5 py-0.5 rounded">{fields.issuetype.name}</span>
        )}
      </div>
      <div className="text-sm text-[#172b4d] mb-2 leading-snug">{fields.summary}</div>
      {fields.assignee && (
        <div className="flex items-center gap-1.5 mt-2">
          {fields.assignee.avatarUrls && (
            <img 
              src={fields.assignee.avatarUrls["24x24"]} 
              alt={fields.assignee.displayName}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-xs text-gray-600">{fields.assignee.displayName}</span>
        </div>
      )}
      {fields.priority && (
        <div className="text-[11px] text-gray-600 mt-1.5">
          Priority: {fields.priority.name}
        </div>
      )}
    </div>
  );
};

export default Ticket;

