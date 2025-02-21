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
    console.log("Creating new leaderboard.json");
    fs.writeFileSync(FILE_PATH, JSON.stringify({ round1: [], round2: [] }, null, 2));
  }
  const data = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
  console.log("Leaderboard read:", data);
  return data;
};

const writeLeaderboard = (data) => {
  console.log("Writing leaderboard:", data);
  fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

app.get("/leaderboard", (req, res) => {
  const leaderboard = readLeaderboard();
  const top5Round1 = leaderboard.round1.sort((a, b) => b.score - a.score).slice(0, 5);
  const allAnswered = leaderboard.round1.length > 0; // For testing
  const round2Players = leaderboard.round2;
  const top3Winners = round2Players.sort((a, b) => b.score - a.score).slice(0, 3);

  const response = {
    round1: leaderboard.round1,
    top5Round1,
    allAnswered,
    round2Locked: !allAnswered,
    round2: allAnswered ? round2Players : [],
    winners: allAnswered ? top3Winners : [],
  };
  console.log("Sending leaderboard response:", response);
  res.json(response);
});

app.post("/leaderboard", (req, res) => {
  console.log("Received POST request:", req.body);
  const { tableNo, score, time, round } = req.body;

  if (tableNo === undefined || score === undefined || time === undefined || !round) {
    console.log("Invalid request data");
    return res.status(400).json({ message: "Table number, score, time, and round are required" });
  }

  if (round !== "round1" && round !== "round2") {
    console.log("Invalid round");
    return res.status(400).json({ message: "Invalid round. Use 'round1' or 'round2'." });
  }

  let leaderboard = readLeaderboard();
  let roundData = leaderboard[round];

  const tableIndex = roundData.findIndex((entry) => entry.tableNo === tableNo);
  let timestamp = new Date().toISOString();
  let normalizedTime = typeof time === "number" ? formatTime(time) : time;

  if (tableIndex !== -1) {
    // Update existing entry instead of allowing duplicates
    console.log(`Updating existing entry for table ${tableNo} in ${round}`);
    if (round === "round1") {
      // For Round 1, only update if not already answered
      if (roundData[tableIndex].answered) {
        console.log("Duplicate Round 1 submission for table:", tableNo);
        return res.status(403).json({ message: "This table has already submitted answers for Round 1" });
      }
      roundData[tableIndex] = {
        ...roundData[tableIndex],
        score,
        time: normalizedTime,
        answered: true,
        updatedAt: timestamp,
      };
    } else if (round === "round2") {
      // For Round 2, update score and time if better
      roundData[tableIndex].score = score; // Replace score instead of adding
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
    // Add new entry if table doesn't exist
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

  // Ensure no duplicates by filtering unique tableNos
  leaderboard[round] = roundData
    .reduce((unique, item) => {
      return unique.some((entry) => entry.tableNo === item.tableNo) ? unique : [...unique, item];
    }, [])
    .sort((a, b) => b.score - a.score);

  writeLeaderboard(leaderboard);

  res.json({ message: "Score updated", leaderboard });
});

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

for (let i = 1; i <= 24; i++) {
  app.get(`/quiz/table${i}`, (req, res) => {
    const leaderboard = readLeaderboard();
    const top5Round1 = leaderboard.round1.sort((a, b) => b.score - a.score).slice(0, 5);
    const allAnswered = leaderboard.round1.length > 0; // For testing
    const isEligibleForRound2 = true; // For testing

    const response = {
      table: i,
      round1: [
        {
          question: "What’s a small fluffy dog with a big personality?",
          options: ["Pomeranian", "Golden Retriever", "Bulldog", "Beagle"],
          answer: "Pomeranian",
        },
        {
          question: "Which dog has long ears and a great nose?",
          options: ["Beagle", "Bloodhound", "Cocker Spaniel", "Basset Hound"],
          answer: "Beagle",
        },
        {
          question: "Known for my sleek build and eye-catching coat that always catch the spotlight, energetic and have a history of running alongside travelers",
          options: ["Husky", "Dalmatian", "Great Dane", "Shiba Inu"],
          answer: "Dalmatian",
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
    };
    console.log(`Sending quiz data for table ${i}:`, response);
    res.json(response);
  });
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));