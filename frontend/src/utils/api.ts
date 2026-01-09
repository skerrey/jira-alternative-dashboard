// Centralized API configuration
// If REACT_APP_API_URL is set, use it; otherwise use relative paths (same origin)
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

// Create axios instance with base URL
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
