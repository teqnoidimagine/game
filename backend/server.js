const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json()); // Parses JSON requests
app.use(express.json()); // Enable JSON parsing

// Fake leaderboard data
let leaderboard = [];

// Health check route
app.get("/health", (req, res) => {
  res.json({ status: "Server is running", port: PORT });
});

// API to get leaderboard data
app.get("/leaderboard", (req, res) => {
  res.json(leaderboard);
});

// API to update leaderboard with new scores and time
app.post("/leaderboard", (req, res) => {
  const { tableNo, score, time } = req.body;

  if (tableNo === undefined || score === undefined || !time) {
    return res.status(400).json({ message: "Table number, score, and time are required" });
  }

  let tableIndex = leaderboard.findIndex((entry) => entry.tableNo === tableNo);

  if (tableIndex !== -1) {
    leaderboard[tableIndex].score += score;

    let existingTime = leaderboard[tableIndex].time.split(":").map(Number);
    let newTime = time.split(":").map(Number);

    let existingTotalSeconds = existingTime[0] * 60 + existingTime[1];
    let newTotalSeconds = newTime[0] * 60 + newTime[1];

    leaderboard[tableIndex].time = newTotalSeconds < existingTotalSeconds ? time : leaderboard[tableIndex].time;
  } else {
    leaderboard.push({ id: leaderboard.length + 1, tableNo, score, time });
  }

  leaderboard.sort((a, b) => b.score - a.score);

  res.json({ message: "Score updated", leaderboard });
});

// Creating quiz routes dynamically with the Pomeranian question
for (let i = 1; i <= 24; i++) {
  app.get(`/quiz/table${i}`, (req, res) => {
    res.json({
      table: i,
      questions: [
        {
          question: "I’m a little ball of fluff with a big personality. My confident strut and fox-like face often turn heads.",
          options: ["Pomeranian", "Golden Retriever", "Bulldog", "Beagle"],
          answer: "Pomeranian"
        }
      ]
    });
  });
}

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
