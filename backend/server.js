require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const jiraRoutes = require("./routes/jira");
const assistantRoutes = require("./routes/assistant");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/jira", jiraRoutes);
app.use("/api/assistant", assistantRoutes);

// Serve static files from the React app in production
if (process.env.NODE_ENV === "production") {
  const frontendBuildPath = path.join(__dirname, "..", "frontend", "build");
  app.use(express.static(frontendBuildPath));
  
  // Serve React app for all non-API routes
  app.get("*", (req, res) => {
    res.sendFile(path.join(frontendBuildPath, "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

