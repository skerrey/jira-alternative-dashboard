import React, { useState, useEffect } from "react";
import axios from "axios";
import Board from "./components/Board";
import SearchBar from "./components/SearchBar";
import UserFilter from "./components/UserFilter";
import { Column, User, Issue } from "./interfaces";

const App = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [selectedUser, searchQuery]);

  const fetchInitialData = async () => {
    try {
      const [columnsRes, usersRes] = await Promise.all([
        axios.get<Column[]>("/api/jira/columns"),
        axios.get<User[]>("/api/jira/users")
      ]);
      setColumns(columnsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setLoading(false);
    }
  };

  console.log(columns);

  const fetchIssues = async () => {
    try {
      const params: Record<string, string> = {};
      if (selectedUser !== "all") {
        params.assignee = selectedUser;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await axios.get<Issue[]>("/api/jira/issues", { params });
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen text-lg text-gray-600">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <header className="bg-white p-5 shadow-sm mb-5">
        <h1 className="text-2xl text-[#172b4d] mb-4">Jira Dashboard</h1>
        <div className="flex gap-4 items-center flex-wrap">
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
};

export default App;

