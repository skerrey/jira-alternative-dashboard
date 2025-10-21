import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Board from './components/Board';
import SearchBar from './components/SearchBar';
import UserFilter from './components/UserFilter';
import './App.css';

function App() {
  const [columns, setColumns] = useState([]);
  const [issues, setIssues] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [selectedUser, searchQuery]);

  const fetchInitialData = async () => {
    try {
      const [columnsRes, usersRes] = await Promise.all([
        axios.get('/api/jira/columns'),
        axios.get('/api/jira/users')
      ]);
      setColumns(columnsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching initial data:', error);
      setLoading(false);
    }
  };

  const fetchIssues = async () => {
    try {
      const params = {};
      if (selectedUser !== 'all') {
        params.assignee = selectedUser;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await axios.get('/api/jira/issues', { params });
      setIssues(response.data);
    } catch (error) {
      console.error('Error fetching issues:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>Jira Dashboard</h1>
        <div className="controls">
          <SearchBar 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
          />
          <UserFilter 
            users={users} 
            selectedUser={selectedUser} 
            setSelectedUser={setSelectedUser} 
          />
        </div>
      </header>
      <Board columns={columns} issues={issues} />
    </div>
  );
}

export default App;

