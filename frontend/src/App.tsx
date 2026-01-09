import React, { useState, useEffect, useCallback } from "react";
import apiClient from "./utils/api";
import Board from "./components/Board";
import SearchBar from "./components/SearchBar";
import UserFilter from "./components/UserFilter";
import TicketModal from "./components/TicketModal";
import Assistant from "./components/Assistant";
import { Column, User, Issue } from "./interfaces";
import { FaCog } from "react-icons/fa";

const App = () => {
  const [columns, setColumns] = useState<Column[]>([]);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [projectName, setProjectName] = useState<string>("Jira Dashboard");
  const [selectedTicket, setSelectedTicket] = useState<Issue | null>(null);
  const [highlightedTicketKey, setHighlightedTicketKey] = useState<string | null>(null);

  const fetchIssues = useCallback(async () => {
    try {
      const params: Record<string, string> = {};
      if (selectedUser !== "all") {
        params.assignee = selectedUser;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const response = await apiClient.get<Issue[]>("/api/jira/issues", { params });
      setIssues(response.data);
    } catch (error) {
      console.error("Error fetching issues:", error);
    }
  }, [selectedUser, searchQuery]);

  useEffect(() => {
    fetchInitialData();
    fetchProjectName();
  }, []);

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const fetchInitialData = async () => {
    try {
      const [columnsRes, usersRes] = await Promise.all([
        apiClient.get<Column[]>("/api/jira/columns"),
        apiClient.get<User[]>("/api/jira/users")
      ]);
      setColumns(columnsRes.data);
      setUsers(usersRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching initial data:", error);
      setLoading(false);
    }
  };

  const fetchProjectName = async () => {
    try {
      const response = await apiClient.get<string>("/api/jira/project");
      setProjectName(`${response.data} Dashboard`);
    } catch (error) {
      console.error("Error fetching project name:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#172b4d] border-t-transparent mb-4"></div>
        <div className="text-lg font-medium text-gray-700">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="px-6 mx-auto py-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#172b4d] mb-1">{projectName}</h1>
              <p className="text-sm text-gray-600">Manage and track your project issues</p>
            </div>
            <button
              className="p-2 text-gray-600 hover:text-[#172b4d] hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Settings"
            >
              <FaCog className="w-6 h-6" />
            </button>
          </div>
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
        </div>
      </header>
      <Board 
        columns={columns} 
        issues={issues} 
        onTicketClick={(issue) => setSelectedTicket(issue)}
        highlightedTicketKey={highlightedTicketKey}
      />
      <TicketModal 
        issue={selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
      />
      <Assistant 
        onHighlightTicket={(ticketKey) => {
          setHighlightedTicketKey(ticketKey);
          // Clear highlight after 3 seconds
          setTimeout(() => setHighlightedTicketKey(null), 3000);
          // Also open the ticket if it exists
          const ticket = issues.find(i => i.key === ticketKey);
          if (ticket) {
            setSelectedTicket(ticket);
          }
        }}
        issues={issues}
      />
    </div>
  );
};

export default App;

