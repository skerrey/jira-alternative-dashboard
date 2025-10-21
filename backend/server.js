require("dotenv").config();
const express = require("express");
const cors = require("cors");
const jiraRoutes = require("./routes/jira");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/api/jira", jiraRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

