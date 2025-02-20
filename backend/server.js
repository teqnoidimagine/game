const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");

const app = express();
const PORT = 5000;
const FILE_PATH = "./leaderboard.json";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const readLeaderboard = () => {
  if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify({ round1: [], round2: [] }, null, 2));
  }
  return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
};

const writeLeaderboard = (data) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// Utility function to convert seconds to MM:SS format
const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

// Get leaderboard
app.get("/leaderboard", (req, res) => {
  const leaderboard = readLeaderboard();

  const top5Round1 = leaderboard.round1.sort((a, b) => b.score - a.score).slice(0, 5);
  const allAnswered = top5Round1.every((player) => player.answered);
  const round2Players = leaderboard.round2.filter((entry) =>
    top5Round1.some((topPlayer) => topPlayer.tableNo === entry.tableNo)
  );
  const top3Winners = round2Players.sort((a, b) => b.score - a.score).slice(0, 3);

  res.json({
    round1: leaderboard.round1,
    top5Round1,
    allAnswered,
    round2Locked: !allAnswered,
    round2: allAnswered ? round2Players : [],
    winners: allAnswered ? top3Winners : [],
  });
});

// Update leaderboard
app.post("/leaderboard", (req, res) => {
  const { tableNo, score, time, round } = req.body;

  if (tableNo === undefined || score === undefined || time === undefined || !round) {
    return res.status(400).json({ message: "Table number, score, time, and round are required" });
  }

  if (round !== "round1" && round !== "round2") {
    return res.status(400).json({ message: "Invalid round. Use 'round1' or 'round2'." });
  }

  let leaderboard = readLeaderboard();
  let roundData = leaderboard[round];

  // Check if the table has already submitted for this round
  const existingEntry = roundData.find((entry) => entry.tableNo === tableNo && entry.answered);
  if (round === "round1" && existingEntry) {
    return res.status(403).json({ message: "This table has already submitted answers for Round 1" });
  }

  if (round === "round2") {
    const top5Round1 = leaderboard.round1.sort((a, b) => b.score - a.score).slice(0, 5);
    const isEligible = top5Round1.some((player) => player.tableNo === tableNo);

    if (!isEligible) {
      return res.status(403).json({ message: "This table is not eligible for Round 2" });
    }
  }

  let tableIndex = roundData.findIndex((entry) => entry.tableNo === tableNo);
  let timestamp = new Date().toISOString();

  // Normalize incoming time to MM:SS format
  let normalizedTime = typeof time === "number" ? formatTime(time) : time;

  if (tableIndex !== -1) {
    // For Round 2, allow updates if not yet submitted
    if (round === "round2") {
      roundData[tableIndex].score += score;
      roundData[tableIndex].updatedAt = timestamp;
      roundData[tableIndex].answered = true;

      let existingTimeStr = String(roundData[tableIndex].time || "00:00");
      let existingTime = existingTimeStr.split(":").map(Number);
      let newTime = normalizedTime.split(":").map(Number);

      let existingTotalSeconds = existingTime[0] * 60 + existingTime[1];
      let newTotalSeconds = newTime[0] * 60 + newTime[1];

      roundData[tableIndex].time = newTotalSeconds < existingTotalSeconds ? normalizedTime : roundData[tableIndex].time;
    }
  } else {
    roundData.push({
      id: roundData.length + 1,
      tableNo,
      score,
      time: normalizedTime,
      answered: true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });
  }

  roundData.sort((a, b) => b.score - a.score);
  leaderboard[round] = roundData;
  writeLeaderboard(leaderboard);

  res.json({ message: "Score updated", leaderboard });
});

// Shuffle function
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

// Dynamic Quiz Routes
for (let i = 1; i <= 24; i++) {
  app.get(`/quiz/table${i}`, (req, res) => {
    const leaderboard = readLeaderboard();
    const top5Round1 = leaderboard.round1.sort((a, b) => b.score - a.score).slice(0, 5);
    const allAnswered = top5Round1.every((player) => player.answered);
    const isEligibleForRound2 = top5Round1.some((player) => player.tableNo === i);

    res.json({
      table: i,
      round1: [
        {
          question: "I’m a little ball of fluff with a big personality. My confident strut and fox-like face often turn heads.",
          options: ["Pomeranian", "Golden Retriever", "Bulldog", "Beagle"],
          answer: "Pomeranian",
        },
        {
          question: "My long ears and powerful nose make me a master tracker. I’m known for my droopy face and howling voice.",
          options: ["Beagle", "Bloodhound", "Cocker Spaniel", "Basset Hound"],
          answer: "Beagle",
        },
      ],
      round2: allAnswered && isEligibleForRound2
        ? {
            gameType: "flip",
            boxes: shuffleArray([
              { id: 1, isCorrect: false },
              { id: 2, isCorrect: false },
              { id: 3, isCorrect: false },
              { id: 4, isCorrect: false },
              { id: 5, isCorrect: true },
              { id: 6, isCorrect: false },
            ]),
          }
        : { locked: true },
    });
  });
}

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));