import React from "react";
import { TicketProps } from "../interfaces";
import { getPriorityColor } from "../utils/getPriorityColor";

const Ticket = ({ issue, onClick, isHighlighted = false }: TicketProps) => {
  const { fields } = issue;

  const priorityColor = fields.priority ? getPriorityColor(fields.priority.name) : "";

  return (
    <div 
      className={`bg-white rounded-lg p-4 mb-3 border-2 shadow-sm cursor-pointer transition-all hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 active:translate-y-0 ${
        isHighlighted 
          ? "border-blue-500 shadow-lg ring-4 ring-blue-200 animate-pulse" 
          : "border-gray-200"
      }`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs text-gray-500 font-mono font-semibold">{issue.key}</span>
        {fields.issuetype && (
          <span className="text-[10px] text-gray-600 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded font-medium">
            {fields.issuetype.name}
          </span>
        )}
      </div>
      <div className="text-sm text-[#172b4d] mb-3 leading-relaxed font-medium line-clamp-2">
        {fields.summary}
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        {fields.assignee && (
          <div className="flex items-center gap-2">
            {fields.assignee.avatarUrls && (
              <img 
                src={fields.assignee.avatarUrls["24x24"]} 
                alt={fields.assignee.displayName}
                className="w-7 h-7 rounded-full border-2 border-white shadow-sm"
              />
            )}
            <span className="text-xs text-gray-600 font-medium truncate max-w-[120px]">
              {fields.assignee.displayName}
            </span>
          </div>
        )}
        {fields.priority && (
          <div className={`text-[10px] px-2 py-1 rounded border font-semibold ${priorityColor}`}>
            {fields.priority.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default Ticket;

