import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useParams } from "react-router-dom";

// import { useState, useEffect } from "react";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("https://game-uaxu.onrender.com/leaderboard");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        padding: "20px",
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f4",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "28px", marginBottom: "20px" }}>
        Leaderboard
      </h1>
      <table
        style={{
          width: "95%",
          borderCollapse: "collapse",
          backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#007BFF", color: "#fff" }}>
          <th style={{ padding: "10px", fontSize: "18px" }}>Table No</th>
            <th style={{ padding: "10px", fontSize: "18px" }}>Score</th>
            <th style={{ padding: "10px", fontSize: "18px" }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player, index) => (
            <tr
              key={player.id}
              style={{
                backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9ecef",
                transition: "background-color 0.3s",
              }}
            >
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "16px",
                }}
              >
               Table {player.id}
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "16px",
                }}
              >
                {player.score}
              </td>
              <td
                style={{
                  padding: "10px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "16px",
                }}
              >
                {player.time}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// export default Leaderboard;


function Quiz() {
  const { tableNumber } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerActive, setTimerActive] = useState(true);

  useEffect(() => {
    fetch(`https://game-uaxu.onrender.com/quiz/table${tableNumber}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched Questions:", data);
        setQuestions(data.questions.slice(0, 3)); // Ensure only 3 questions
      })
      .catch((error) => console.error("Error fetching questions:", error));
  }, [tableNumber]);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => {
        setTimeTaken((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  const handleAnswer = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateScore = () => {
    let newScore = 0;
    questions.forEach((q, index) => {
      if (answers[index] === q.answer) {
        newScore += 1;
      }
    });
    return newScore;
  };
  const formatTime = (seconds) => {
    let mins = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };
  const handleSubmit = () => {
    setTimerActive(false); // Stop the timer
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);

    const playerName = prompt("Enter your name:");
    const formattedTime = formatTime(timeTaken);
    fetch("https://game-uaxu.onrender.com/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNo: Number(tableNumber), score: finalScore, time: formattedTime  }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Leaderboard Updated:", data);
        alert(`Quiz submitted! Your score: ${finalScore}, Time Taken: ${timeTaken} sec`);
      })
      .catch((error) => console.error("Error updating leaderboard:", error));
  };

  return (
    <div style={{ padding: "20px", textAlign: "center", maxWidth: "600px", margin: "auto" }}>
      <h1>Math Quiz - Table {tableNumber}</h1>
      <h3>⏳ Time Taken: {timeTaken} sec</h3>
      {isSubmitted ? (
        <h2>Your final score: {score}</h2>
      ) : questions.length > 0 ? (
        <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px", backgroundColor: "#f8f9fa" }}>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            {currentQuestionIndex + 1}. {questions[currentQuestionIndex].question}
          </p>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {questions[currentQuestionIndex].options.map((option, idx) => (
              <li
                key={idx}
                onClick={() => handleAnswer(option)}
                style={{
                  padding: "10px",
                  margin: "5px 0",
                  border: answers[currentQuestionIndex] === option ? "2px solid green" : "1px solid #ccc",
                  borderRadius: "5px",
                  cursor: "pointer",
                  background: answers[currentQuestionIndex] === option ? "#d4edda" : "#fff",
                }}
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading questions...</p>
      )}

      {!isSubmitted && (
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              marginRight: "10px",
              cursor: currentQuestionIndex === 0 ? "not-allowed" : "pointer",
              backgroundColor: currentQuestionIndex === 0 ? "#ccc" : "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Previous
          </button>

          {currentQuestionIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#ff5733",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Submit
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              style={{
                padding: "10px 20px",
                fontSize: "16px",
                backgroundColor: "#28a745",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Next
            </button>
          )}
        </div>
      )}
    </div>
  );
}





function App() {
  return (
    <Router>
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Math Quiz</h1>
        <nav>
          <Link to="/leaderboard">Leaderboard</Link>
          {[...Array(24).keys()].map((i) => (
            <Link key={i} to={`/quiz/table/${i + 1}`} style={{ marginLeft: "10px" }}>
              Table {i + 1}
            </Link>
          ))}
        </nav>
        <Routes>
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path="/quiz/table/:tableNumber" element={<Quiz />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
