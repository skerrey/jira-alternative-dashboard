import React from "react";
import Ticket from "./Ticket";
import { ColumnProps } from "../interfaces";
import { getColStatusColor } from "../utils/getColStatusColor";

const Column = ({ column, issues, onTicketClick, highlightedTicketKey }: ColumnProps) => {
  const statusColor = getColStatusColor(column.name);

  return (
    <div className="bg-white rounded-lg min-w-[300px] max-w-[300px] flex flex-col max-h-[calc(100vh-250px)] border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className={`p-4 flex justify-between items-center border-b-2 ${statusColor}`}>
        <h3 className="text-sm font-bold text-current uppercase tracking-wide">{column.name}</h3>
        <span className="bg-white bg-opacity-80 text-current px-2.5 py-1 rounded-full text-xs font-bold min-w-[28px] text-center">
          {issues.length}
        </span>
      </div>
      <div className="px-3 py-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        {issues.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm font-medium">No issues</p>
            <p className="text-xs mt-1">Drag issues here or create new ones</p>
          </div>
        ) : (
          issues.map(issue => (
            <Ticket 
              key={issue.id} 
              issue={issue} 
              onClick={() => onTicketClick(issue)}
              isHighlighted={highlightedTicketKey === issue.key}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Column;

