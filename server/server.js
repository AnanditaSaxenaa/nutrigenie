require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5173; // Use 5000 or any other port different from frontend

// Middleware
app.use(cors());
app.use(express.json()); // Parses JSON body

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schema & Model
const GoalSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  goal: String,
  plan: String,
});

const Goal = mongoose.model("Goal", GoalSchema);

// Routes

// Test route
app.get("/", (req, res) => {
  res.send("Backend working!");
});

// Save goal & plan to DB
app.post("/api/save", async (req, res) => {
  try {
    const savedGoal = await Goal.create(req.body);
    res.status(201).json(savedGoal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save goal" });
  }
});

// Fetch all goals
app.get("/api/goals", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch goals" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
