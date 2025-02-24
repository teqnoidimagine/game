const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Octokit } = require("@octokit/rest");

const app = express();

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const OWNER = "teqnoidimagine";
const REPO = "quiz-leaderboard";
const PATH = "leaderboard.json";
const octokit = new Octokit({ auth: GITHUB_TOKEN });

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const readLeaderboard = async () => {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: PATH,
    });
    const content = Buffer.from(data.content, "base64").toString("utf8");
    console.log("Leaderboard read from GitHub:", content);
    return JSON.parse(content);
  } catch (error) {
    if (error.status === 404) {
      console.log("No leaderboard found, initializing...");
      const initialData = { round1: [], round2: [] };
      await writeLeaderboard(initialData);
      return initialData;
    }
    console.error("Error reading from GitHub:", error);
    return { round1: [], round2: [] };
  }
};

const writeLeaderboard = async (data) => {
  try {
    let sha;
    try {
      const { data: file } = await octokit.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: PATH,
        branch: "main",
      });
      sha = file.sha;
      console.log("Fetched SHA for update:", sha);
    } catch (error) {
      if (error.status === 404) {
        console.log("File not found, will create new file");
        sha = undefined;
      } else {
        console.error("Unexpected error fetching SHA:", error);
        throw error;
      }
    }

    const content = JSON.stringify(data, null, 2);
    const base64Content = Buffer.from(content).toString("base64");
    const requestBody = {
      owner: OWNER,
      repo: REPO,
      path: PATH,
      message: "Update leaderboard",
      content: base64Content,
      sha: sha,
      branch: "main",
    };
    console.log("Sending PUT request with body:", JSON.stringify(requestBody, null, 2));

    const response = await octokit.repos.createOrUpdateFileContents(requestBody);
    console.log("Leaderboard written to GitHub, new SHA:", response.data.commit.sha);
    return response;
  } catch (error) {
    console.error("Error writing to GitHub:", error);
    throw error;
  }
};

const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

const formatTimestamp = (date) => {
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: true,
    timeZone: "UTC",
  }) + " UTC";
};

app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running", timestamp: new Date().toISOString() });
});

app.get("/leaderboard", async (req, res) => {
  try {
    const leaderboard = await readLeaderboard();
    
    // Sort Round 1 by score (descending) and time (ascending) for ties
    const sortedRound1 = leaderboard.round1.sort((a, b) => {
      // First, sort by score (descending)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by time (ascending)
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB;
    });

    const top5Round1 = sortedRound1.slice(0, 5); // Keep top 5 for consistency, but you can change to top 10 if needed
    const allAnswered = leaderboard.round1.length > 0;
    const round2Players = leaderboard.round2;

    // Sort Round 2 by score (descending) and time (ascending) for ties
    const sortedRound2 = round2Players.sort((a, b) => {
      // First, sort by score (descending)
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // If scores are equal, sort by time (ascending)
      const timeA = parseTime(a.time);
      const timeB = parseTime(b.time);
      return timeA - timeB;
    });

    // Filter out players with score 0 for winners and get top 3
    const top3Winners = sortedRound2
      .filter((player) => player.score > 0)
      .slice(0, 3);

    const response = {
      round1: sortedRound1, // Return the full sorted Round 1 list
      top5Round1, // Keep top 5 for consistency, but you can adjust to top 10
      allAnswered,
      round2Locked: !allAnswered,
      round2: allAnswered ? sortedRound2 : [], // Return the full sorted Round 2 list
      winners: allAnswered ? top3Winners : [],
    };
    console.log("Sending leaderboard response:", response);
    res.json(response);
  } catch (error) {
    console.error("Error in GET /leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
});

// Helper function to parse time string (e.g., "0:55" or "00:48") into seconds
function parseTime(timeStr) {
  if (!timeStr) return 0;
  const [minutes, seconds] = timeStr.split(":").map(Number);
  return (minutes || 0) * 60 + (seconds || 0);
}
app.post("/leaderboard", async (req, res) => {
  try {
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

    let leaderboard = await readLeaderboard();
    let roundData = leaderboard[round];

    const tableIndex = roundData.findIndex((entry) => entry.tableNo === tableNo);
    let timestamp = formatTimestamp(new Date());
    let normalizedTime = typeof time === "number" ? formatTime(time) : time;

    if (tableIndex !== -1) {
      console.log(`Updating existing entry for table ${tableNo} in ${round}`);
      if (round === "round1") {
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
        roundData[tableIndex].score = score;
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

    leaderboard[round] = roundData
      .reduce((unique, item) => {
        return unique.some((entry) => entry.tableNo === item.tableNo) ? unique : [...unique, item];
      }, [])
      .sort((a, b) => b.score - a.score);

    await writeLeaderboard(leaderboard);
    res.json({ message: "Score updated", leaderboard });
  } catch (error) {
    console.error("Error in POST /leaderboard:", error);
    res.status(500).json({ error: "Failed to update leaderboard" });
  }
});

// New endpoint to clear the leaderboard
app.delete("/leaderboard", async (req, res) => {
  try {
    const initialData = { round1: [], round2: [] };
    await writeLeaderboard(initialData);
    console.log("Leaderboard cleared");
    res.json({ message: "Leaderboard cleared successfully" });
  } catch (error) {
    console.error("Error clearing leaderboard:", error);
    res.status(500).json({ error: "Failed to clear leaderboard" });
  }
});

const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

for (let i = 1; i <= 24; i++) {
  app.get(`/quiz/table${i}`, async (req, res) => {
    try {
      const leaderboard = await readLeaderboard();
      const top5Round1 = leaderboard.round1.sort((a, b) => b.score - a.score).slice(0, 5);
      const allAnswered = leaderboard.round1.length > 0;
      const isEligibleForRound2 = true;

      const response = {
        table: i,
        round1: [
          {
            question: "My long ears and powerful nose make me a master tracker. I’m known for my droopy face and howling voice?",
            options: ["Lihasa", "Husky", "Beagle", "Bull dog"],
            answer: "Beagle",
          },
          {
            question: "I’m a little ball of fluff with a big personality. My confident strut and fox-like face often turn heads?",
            options: ["Beagle", "Pomeranian", "Corgi", "Bull dog"],
            answer: "Pomeranian",
          },
          {
            question: "Known for my sleek build and eye-catching coat that always catch the spotlight, energetic and have a history of running alongside travelers?",
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
              ]),
            }
          : { locked: true },
      };
      console.log(`Sending quiz data for table ${i}:`, response);
      res.json(response);
    } catch (error) {
      console.error(`Error in GET /quiz/table${i}:`, error);
      res.status(500).json({ error: "Failed to fetch quiz data" });
    }
  });
}

module.exports = app;