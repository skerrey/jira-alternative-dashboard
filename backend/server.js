require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jiraRoutes = require("./routes/jira");
const assistantRoutes = require("./routes/assistant");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/jira", jiraRoutes);
app.use("/api/assistant", assistantRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

