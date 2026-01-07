import React from "react";
import { UserFilterProps } from "../interfaces";

const UserFilter = ({ users, selectedUser, setSelectedUser }: UserFilterProps) => {
  return (
    <div className="min-w-[220px] relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      </div>
      <select 
        value={selectedUser} 
        onChange={(e) => setSelectedUser(e.target.value)}
        className="w-full pl-10 pr-10 py-2.5 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 shadow-sm hover:border-gray-300 appearance-none"
      >
        <option value="all">All Users</option>
        {users.map(user => (
          <option key={user.accountId} value={user.accountId}>
            {user.displayName}
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

export default UserFilter;

