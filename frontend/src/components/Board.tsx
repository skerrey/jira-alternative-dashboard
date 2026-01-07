import Column from "./Column";
import { BoardProps, Issue } from "../interfaces";

const Board = ({ columns, issues, onTicketClick, highlightedTicketKey }: BoardProps) => {

  const getIssuesByStatus = (statusName: string): Issue[] => {
    return issues.filter(issue => issue.fields.status.name === statusName);
  };

  return (
    <div className="flex gap-5 px-6 py-6 overflow-x-auto flex-1 pb-8">
      {columns.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No columns available</p>
            <p className="text-sm">Configure your project columns to get started</p>
          </div>
        </div>
      ) : (
        columns.map(column => (
          <Column 
            key={column.id} 
            column={column} 
            issues={getIssuesByStatus(column.name)}
            onTicketClick={onTicketClick}
            highlightedTicketKey={highlightedTicketKey}
          />
        ))
      )}
    </div>
  );
};

export default Board;

