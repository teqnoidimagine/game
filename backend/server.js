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

// Creating quiz routes dynamically with harder questions
for (let i = 1; i <= 24; i++) {
  app.get(`/quiz/table${i}`, (req, res) => {
    const operators = ["+", "-", "×", "÷", "^", "√"];
    
    const questions = Array.from({ length: 3 }, () => {
      let num1, num2, operator, answer;

      operator = operators[Math.floor(Math.random() * operators.length)];

      if (operator === "^") {
        num1 = Math.floor(Math.random() * 20) + 5;
        num2 = Math.floor(Math.random() * 2) + 2;
        answer = Math.pow(num1, num2);
      } else if (operator === "√") {
        num1 = Math.floor(Math.random() * 30) + 20;
        answer = Math.sqrt(num1);
        num1 = Math.pow(answer, 2);
        num2 = "";
      } else {
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 50) + 1;

        switch (operator) {
          case "+": answer = num1 + num2; break;
          case "-": answer = num1 - num2; break;
          case "×": answer = num1 * num2; break;
          case "÷": answer = parseFloat((num1 / num2).toFixed(2)); break;
        }
      }

      // Generate unique options
      let options = new Set();
      options.add(answer);

      while (options.size < 4) {
        let randomOffset = Math.floor(Math.random() * 20) - 10;
        let fakeAnswer = operator === "÷" ? parseFloat((answer + randomOffset / 10).toFixed(2)) : answer + randomOffset;

        if (!options.has(fakeAnswer)) {
          options.add(fakeAnswer);
        }
      }

      return {
        question: operator === "√" ? `√${num1} = ?` : `${num1} ${operator} ${num2} = ?`,
        options: Array.from(options).sort(() => Math.random() - 0.5),
        answer
      };
    });

    res.json({ table: i, questions });
  });
}

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
