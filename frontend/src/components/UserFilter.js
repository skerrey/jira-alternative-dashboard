import React from 'react';
import './UserFilter.css';

function UserFilter({ users, selectedUser, setSelectedUser }) {
  return (
    <div className="user-filter">
      <select 
        value={selectedUser} 
        onChange={(e) => setSelectedUser(e.target.value)}
        className="user-select"
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

