import React from "react";
import Ticket from "./Ticket";
import { ColumnProps } from "../interfaces";

const Column = ({ column, issues }: ColumnProps) => {
  return (
    <div className="bg-gray-100 rounded min-w-[280px] max-w-[280px] flex flex-col max-h-[calc(100vh-200px)]">
      <div className="p-3 flex justify-between items-center">
        <h3 className="text-sm font-semibold text-[#172b4d] uppercase">{column.name}</h3>
        <span className="bg-gray-300 text-[#42526e] px-2 py-0.5 rounded-xl text-xs font-semibold">{issues.length}</span>
      </div>
      <div className="px-3 pb-3 overflow-y-auto flex-1">
        {issues.map(issue => (
          <Ticket key={issue.id} issue={issue} />
        ))}
      </div>
    </div>
  );
};

export default Column;

