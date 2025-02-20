import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';

import arrowW from './arrowW.png';
import arrowG from './arrowG.png';

const baseUrl = "http://localhost:5000/";

// 🎉 Welcome Page Component
function Welcome() {
  const navigate = useNavigate();
  const { tableNumber } = useParams();

  return (
    <div
      style={{
        backgroundImage: "url('/welcome.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        textAlign: "center",
        padding: "0%",
        backgroundColor: "#4dd766",
        height: "100vh",
        color: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => navigate(`/quiz/${tableNumber}`)}
        style={{
          position: "absolute",
          bottom: "2vh",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Start <span><img src={arrowG} width="35px" /></span>
      </button>
    </div>
  );
}

// 🏆 Leaderboard Component
function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  const fetchLeaderboard = async () => {
    try {
      const response = await fetch(`${baseUrl}leaderboard`);
      const data = await response.json();
      const sortedRound1 = data.round1.sort((a, b) =>
        b.score === a.score ? a.time.localeCompare(b.time) : b.score - a.score
      );
      const sortedRound2 = data.round2.sort((a, b) =>
        b.score === a.score ? a.time.localeCompare(b.time) : b.score - a.score
      );
      setLeaderboard({
        round1: sortedRound1,
        round2: data.allAnswered ? sortedRound2 : [],
        winners: data.winners,
      });
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
        backgroundColor: "#0c8240",
        minHeight: "100vh",
        color: "black",
      }}
    >
      <h1 style={{ color: "white" }}>Leaderboard</h1>
      <div>
        <h2 style={{ color: "white" }}>Round 1</h2>
        <table
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            overflow: "hidden",
            width: "100%",
            paddingTop: "15%",
            paddingBottom: "15%",
            backgroundImage: "url('/Union.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        >
          <thead>
            <tr style={{ background: "none" }}>
              <th style={{ padding: "5px", fontSize: "14px" }}>Table No</th>
              <th style={{ padding: "5px", fontSize: "14px" }}>Score</th>
              <th style={{ padding: "5px", fontSize: "14px" }}>Time</th>
            </tr>
          </thead>
          <tbody style={{ background: "none" }}>
            {leaderboard.round1?.map((player, index) => (
              <tr key={player.id}>
                <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                  Table {player.tableNo}
                </td>
                <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                  {player.score}
                </td>
                <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                  {player.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {leaderboard.round2?.length > 0 && (
          <>
            <h2 style={{ color: "white", marginTop: "20px" }}>Round 2</h2>
            <table
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
                paddingTop: "15%",
                paddingBottom: "15%",
                backgroundImage: "url('/Union.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <thead>
                <tr style={{ background: "none" }}>
                  <th style={{ padding: "5px", fontSize: "14px" }}>Table No</th>
                  <th style={{ padding: "5px", fontSize: "14px" }}>Score</th>
                  <th style={{ padding: "5px", fontSize: "14px" }}>Time</th>
                </tr>
              </thead>
              <tbody style={{ background: "none" }}>
                {leaderboard.round2.map((player, index) => (
                  <tr key={player.id}>
                    <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                      Table {player.tableNo}
                    </td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                      {player.score}
                    </td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                      {player.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {leaderboard.winners?.length > 0 && (
          <>
            <h2 style={{ color: "white", marginTop: "20px" }}>Winners</h2>
            <table
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "10px",
                overflow: "hidden",
                width: "100%",
                paddingTop: "15%",
                paddingBottom: "15%",
                backgroundImage: "url('/Union.png')",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
              }}
            >
              <thead>
                <tr style={{ background: "none" }}>
                  <th style={{ padding: "5px", fontSize: "14px" }}>Table No</th>
                  <th style={{ padding: "5px", fontSize: "14px" }}>Score</th>
                  <th style={{ padding: "5px", fontSize: "14px" }}>Time</th>
                </tr>
              </thead>
              <tbody style={{ background: "none" }}>
                {leaderboard.winners.map((player, index) => (
                  <tr key={player.id}>
                    <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                      Table {player.tableNo}
                    </td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                      {player.score}
                    </td>
                    <td style={{ padding: "5px", borderBottom: "1px solid #ddd", fontSize: "12px" }}>
                      {player.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>
    </div>
  );
}

// 📝 Quiz Component
function Quiz() {
  const { tableNumber } = useParams();
  const [round1Questions, setRound1Questions] = useState([]);
  const [round2Data, setRound2Data] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState({ round1: 0, round2: 0 });
  const [isSubmitted, setIsSubmitted] = useState({ round1: false, round2: false });
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [currentRound, setCurrentRound] = useState("round1");
  const [flippedBoxes, setFlippedBoxes] = useState([]);
  const navigate = useNavigate();

  // Fetch quiz data
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await fetch(`${baseUrl}quiz/table${tableNumber}`);
        const data = await response.json();
        setRound1Questions(data.round1 || []);
        setRound2Data(data.round2 || { locked: true });
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };
    fetchQuizData();
  }, [tableNumber]);

  // Timer
  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setTimeTaken((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  // Round 1 answer handling
  const handleAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < round1Questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const calculateRound1Score = () => {
    let newScore = 0;
    round1Questions.forEach((q, index) => {
      if (answers[index] === q.answer) newScore += 1;
    });
    return newScore;
  };

  const handleRound1Submit = async () => {
    setTimerActive(false);
    const finalScore = calculateRound1Score();
    setScore((prev) => ({ ...prev, round1: finalScore }));
    setIsSubmitted((prev) => ({ ...prev, round1: true }));
  
    const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}`;
    try {
      const response = await fetch(`${baseUrl}leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNo: Number(tableNumber), score: finalScore, time: timeFormatted, round: "round1" }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message); // Display the error message (e.g., "This table has already submitted answers for Round 1")
        return;
      }
  
      if (round2Data && !round2Data.locked) {
        setCurrentRound("round2");
        setTimerActive(true);
        setTimeTaken(0);
      }
    } catch (error) {
      console.error("Error updating leaderboard:", error);
      alert("An error occurred while submitting your score.");
    }
  };

  // Round 2 flip game handling
  const handleBoxFlip = async (box) => {
    if (flippedBoxes.includes(box.id) || isSubmitted.round2) return;

    setFlippedBoxes((prev) => [...prev, box.id]);
    const newScore = box.isCorrect ? 5 : 0; // 5 points for correct box
    setScore((prev) => ({ ...prev, round2: prev.round2 + newScore }));

    if (box.isCorrect || flippedBoxes.length + 1 === round2Data.boxes.length) {
      setTimerActive(false);
      setIsSubmitted((prev) => ({ ...prev, round2: true }));
      const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}`;
      await fetch(`${baseUrl}leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNo: Number(tableNumber), score: newScore, time: timeFormatted, round: "round2" }),
      });
    }
  };

  const handleLeaderboardClick = () => {
    navigate('/leaderboard');
  };

  const totalQuestions = round1Questions.length;

  return (
    <div
      style={{
        backgroundImage: "url('/page2.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        padding: "0px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <div style={{ color: "white", paddingTop: "2%", fontSize: "30px" }}>
        Table {tableNumber} - {currentRound === "round1" ? "Round 1" : "Round 2"}
      </div>
      <h3 style={{ color: "white", marginTop: "27%", marginBottom: "2%" }}>
        ⏳ Time Taken: {timeTaken} sec
      </h3>

      {currentRound === "round1" && !isSubmitted.round1 && round1Questions.length > 0 && (
        <>
          <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <p style={{ color: "white", margin: "5px" }}>0{currentQuestionIndex + 1}</p>
            <div style={{ display: "flex", gap: "8px" }}>
              {[...Array(totalQuestions)].map((_, index) => (
                <div
                  key={index}
                  style={{
                    backgroundColor: index === currentQuestionIndex ? "#4dd766" : "white",
                    height: "10px",
                    width: "10px",
                    borderRadius: "100%",
                  }}
                />
              ))}
            </div>
          </div>
          <div
            style={{
              height: "50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: "url('/Union.png')",
              backgroundSize: "contain",
              backgroundRepeat: "no-repeat",
            }}
          >
            <p style={{ fontSize: "18px", fontWeight: "bold" }}>{round1Questions[currentQuestionIndex].question}</p>
            <ul style={{ display: "flex", justifyContent: "space-evenly", gap: "10px", listStyleType: "none", padding: 0 }}>
              {round1Questions[currentQuestionIndex].options.map((option, idx) => (
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
          <div style={{ marginTop: "20px" }}>
            {currentQuestionIndex === totalQuestions - 1 ? (
              <button
                onClick={handleRound1Submit}
                style={{ cursor: "pointer", border: "none", padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", fontSize: "20px" }}
              >
                Submit
              </button>
            ) : (
              <button
                onClick={nextQuestion}
                style={{ cursor: "pointer", border: "none", padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", fontSize: "20px" }}
              >
                Next <span><img src={arrowW} width="35px" /></span>
              </button>
            )}
          </div>
        </>
      )}

      {currentRound === "round1" && isSubmitted.round1 && (
        <div>
          <h2 style={{ color: "white" }}>Round 1 Score: {score.round1}</h2>
          {round2Data?.locked ? (
            <p style={{ color: "white" }}>Waiting for Round 2 to unlock...</p>
          ) : (
            <p style={{ color: "white" }}>Round 2 is ready!</p>
          )}
        </div>
      )}

      {currentRound === "round2" && round2Data && !round2Data.locked && (
        <div style={{ height: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h3 style={{ color: "white" }}>Flip Game - Find the Correct Box!</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
            {round2Data.boxes.map((box) => (
              <div
                key={box.id}
                onClick={() => handleBoxFlip(box)}
                style={{
                  width: "50px",
                  height: "50px",
                  backgroundColor: flippedBoxes.includes(box.id) ? (box.isCorrect ? "green" : "red") : "#ccc",
                  borderRadius: "5px",
                  cursor: isSubmitted.round2 ? "default" : "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "white",
                }}
              >
                {flippedBoxes.includes(box.id) ? (box.isCorrect ? "✓" : "✗") : "?"}
              </div>
            ))}
          </div>
          {isSubmitted.round2 && (
            <>
              <h2 style={{ color: "white", marginTop: "20px" }}>Round 2 Score: {score.round2}</h2>
              <button
                onClick={handleLeaderboardClick}
                style={{ cursor: "pointer", border: "none", padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", fontSize: "20px" }}
              >
                Check Leaderboard
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// 🔗 Main App Component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome/:tableNumber" element={<Welcome />} />
        <Route path="/quiz/:tableNumber" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}