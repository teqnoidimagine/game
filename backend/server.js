const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json()); // Parses JSON requests
app.use(express.json()); // Enable JSON parsing

// Fake leaderboard data
let leaderboard = [
  { id: 1, tableNo: 1, score: 120, time: "00:30" },
  { id: 2, tableNo: 2, score: 95, time: "00:45" },
];

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
    // Convert tableNo to a number if it's not already
    tableNo = Number(tableNo);
    score = Number(score);
  

  // Check if table exists
  let tableIndex = leaderboard.findIndex((entry) => entry.tableNo === tableNo);

  if (tableIndex !== -1) {
    // Update existing table entry
    leaderboard[tableIndex].score += score;

    // Convert time to seconds and update the best time (minimum)
    let existingTime = leaderboard[tableIndex].time.split(":").map(Number);
    let newTime = time.split(":").map(Number);

    let existingTotalSeconds = existingTime[0] * 60 + existingTime[1];
    let newTotalSeconds = newTime[0] * 60 + newTime[1];

    // Keep the better (lower) time
    leaderboard[tableIndex].time = newTotalSeconds < existingTotalSeconds ? time : leaderboard[tableIndex].time;
  } else {
    // Add new table entry
    leaderboard.push({ id: leaderboard.length + 1, tableNo, score, time });
  }

  // Sort leaderboard by highest score
  leaderboard.sort((a, b) => b.score - a.score);

  res.json({ message: "Score updated", leaderboard });
});

// Creating quiz routes dynamically
for (let i = 1; i <= 24; i++) {
  app.get(`/quiz/table${i}`, (req, res) => {
    const operators = ["+", "-", "×", "÷"];
    const questions = Array.from({ length: 3 }, () => {
      const num1 = Math.floor(Math.random() * 20) + 1;
      const num2 = Math.floor(Math.random() * 20) + 1;
      const operator = operators[Math.floor(Math.random() * operators.length)];
      let answer;

      switch (operator) {
        case "+": answer = num1 + num2; break;
        case "-": answer = num1 - num2; break;
        case "×": answer = num1 * num2; break;
        case "÷": answer = parseFloat((num1 / num2).toFixed(2)); break;
      }

      const options = [answer, answer + 1, answer - 1, answer + 2].sort(() => Math.random() - 0.5);
      return { question: `${num1} ${operator} ${num2} = ?`, options, answer };
    });
    res.json({ table: i, questions });
  });
}

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
