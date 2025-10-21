import React from "react";

interface User {
  accountId: string;
  displayName: string;
}

interface UserFilterProps {
  users: User[];
  selectedUser: string;
  setSelectedUser: (userId: string) => void;
}

function UserFilter({ users, selectedUser, setSelectedUser }: UserFilterProps) {
  return (
    <div className="min-w-[200px]">
      <select 
        value={selectedUser} 
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full px-3 py-2 border-2 border-gray-300 rounded text-sm bg-white cursor-pointer outline-none transition-colors focus:border-blue-600"
      >
        <option value="all">All Users</option>
        {users.map(user => (
          <option key={user.accountId} value={user.accountId}>
            {user.displayName}
          </option>
        ))}
      </select>
    </div>
  );
}

export default UserFilter;

