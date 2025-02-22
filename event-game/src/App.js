import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useParams,
  Navigate,
} from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import arrowW from "./arrowW.png";
import arrowG from "./arrowG.png";
import loadingGif from "./loading.gif";
import thankYouImage1 from "./huft11.png";
import thankYouImage2 from "./huft12.png";
import thankYouImage3 from "./huft13.png";
import wrongImage1 from "./wrong1.png";
import wrongImage2 from "./wrong2.png";
import wrongImage3 from "./wrong3.png";
import timerIcon from "./timer.png";

// const baseUrl = "http://localhost:5000/";
const baseUrl = "http://game-imhw.vercel.app/";

// Welcome Page Component
function Welcome() {
  const navigate = useNavigate();
  const { tableNumber } = useParams();

  return (
    <div
      style={{
        backgroundImage: "url('/welcome.png')",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        textAlign: "center",
        padding: "0%",
        backgroundColor: "#13954D",
        height: "100vh",
        color: "white",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <button
        onClick={() => navigate(`/instruction/${tableNumber}`)} // Navigate to Instruction
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

// Instruction Page Component
function Instruction() {
  const navigate = useNavigate();
  const { tableNumber } = useParams();

  return (
    <div
      style={{
        backgroundColor: "#0c8240", // Example background color, adjust as needed
        height: "100vh",
        color: "white",
        textAlign: "center",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>Instructions</h1>
      <p style={{ fontSize: "18px", marginBottom: "20px" }}>
        Welcome to the Quiz! Please read the following instructions carefully:
      </p>
      <ul style={{ listStyleType: "none", padding: "0", fontSize: "16px", textAlign: "left", maxWidth: "500px" }}>
        <li style={{ marginBottom: "10px" }}>1. You have 120 seconds to complete Round 1.</li>
        <li style={{ marginBottom: "10px" }}>2. Select an answer for each question before proceeding.</li>
        <li style={{ marginBottom: "10px" }}>3. Click "Submit" to move to the next question or finish the quiz.</li>
        <li style={{ marginBottom: "10px" }}>4. Top 10 scorers proceed to Round 2.</li>
      </ul>
      <button
        onClick={() => navigate(`/quiz/${tableNumber}`)} // Navigate to Quiz
        style={{
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Proceed to Quiz <span><img src={arrowG} width="35px" /></span>
      </button>
    </div>
  );
}

// Leaderboard Component
function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState({ round1: [], round2: [], winners: [] });
  const [isLoading, setIsLoading] = useState(false);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}leaderboard`);
      const data = await response.json();
      setLeaderboard({
        round1: data.round1.sort((a, b) => b.score - a.score),
        round2: data.round2.sort((a, b) => b.score - a.score),
        winners: data.winners,
      });
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
      toast.error("Failed to fetch leaderboard");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 50000);
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
      {isLoading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <img src={loadingGif} alt="Loading..." style={{ width: "100px" }} />
        </div>
      ) : (
        <>
          <h1 style={{ color: "white" }}>Leaderboard</h1>

          {/* Round 1 */}
          <h2 style={{ color: "white" }}>Round 1</h2>
          <table
            style={{
              width: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundImage: "url('/Union.png')",
              backgroundColor: "white",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <thead>
              <tr style={{ background: "none" }}>
                <th style={{ padding: "5px" }}>Serial No</th>
                <th style={{ padding: "5px" }}>Table No</th>
                <th style={{ padding: "5px" }}>Score</th>
                <th style={{ padding: "5px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.round1.map((player, index) => (
                <tr key={player.id}>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{index + 1}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.tableNo}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.score}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Round 2 */}
          <h2 style={{ color: "white", marginTop: "20px" }}>Round 2</h2>
          <table
            style={{
              width: "100%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              borderRadius: "10px",
              overflow: "hidden",
              backgroundImage: "url('/Union.png')",
              backgroundColor: "white",
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          >
            <thead>
              <tr style={{ background: "none" }}>
                <th style={{ padding: "5px" }}>Serial No</th>
                <th style={{ padding: "5px" }}>Table No</th>
                <th style={{ padding: "5px" }}>Score</th>
                <th style={{ padding: "5px" }}>Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.round2.map((player, index) => (
                <tr key={player.id}>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{index + 1}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.tableNo}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.score}</td>
                  <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.time}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Winners */}
          {leaderboard.winners.length > 0 && (
            <>
              <h2 style={{ color: "white", marginTop: "20px" }}>Winners</h2>
              <table
                style={{
                  width: "100%",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  borderRadius: "10px",
                  overflow: "hidden",
                  backgroundColor: "white",
                  backgroundSize: "cover",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <thead>
                  <tr style={{ background: "none" }}>
                    <th style={{ padding: "5px" }}>Serial No</th>
                    <th style={{ padding: "5px" }}>Table No</th>
                    <th style={{ padding: "5px" }}>Score</th>
                    <th style={{ padding: "5px" }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.winners.map((player, index) => (
                    <tr key={player.id}>
                      <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{index + 1}</td>
                      <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.tableNo}</td>
                      <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.score}</td>
                      <td style={{ padding: "5px", borderBottom: "1px solid #ddd" }}>{player.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </>
      )}
    </div>
  );
}

// Quiz Component
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
  const [attempts, setAttempts] = useState(0);
  const [notification, setNotification] = useState("");
  const [isTop10, setIsTop10] = useState(false);
  const [countdown, setCountdown] = useState(20);
  const [feedbackTimer, setFeedbackTimer] = useState(3); // Feedback countdown
  const [tableInput, setTableInput] = useState("");
  const [showTableVerification, setShowTableVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}quiz/table${tableNumber}`);
        const data = await response.json();
        setRound1Questions(data.round1 || round1Questions);
        setRound2Data(data.round2 || { locked: true });
      } catch (error) {
        console.error("Error fetching quiz data:", error);
        toast.error("Failed to load quiz data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizData();
  }, [tableNumber]);

  useEffect(() => {
    let timer;
    if (timerActive && currentRound === "round1" && !isSubmitted.round1) {
      timer = setInterval(() => {
        setTimeTaken((prev) => {
          if (prev >= 120) {
            handleRound1Submit(true);
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, currentRound, isSubmitted.round1]);

  useEffect(() => {
    let countdownTimer;
    if (isSubmitted.round1 && currentRound === "round1" && !showTableVerification) {
      setNotification("Waiting for results...");
      countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            checkTop10();
            clearInterval(countdownTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(countdownTimer);
  }, [isSubmitted.round1, currentRound, showTableVerification]);

  useEffect(() => {
    let timer;
    if (timerActive && currentRound === "round2" && !isSubmitted.round2) {
      timer = setInterval(() => setTimeTaken((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, currentRound, isSubmitted.round2]);

  useEffect(() => {
    let feedbackInterval;
    if (showFeedback) {
      setFeedbackTimer(3);
      feedbackInterval = setInterval(() => {
        setFeedbackTimer((prev) => {
          if (prev <= 1) {
            clearInterval(feedbackInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(feedbackInterval);
  }, [showFeedback]);

  const handleAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
    const correctAnswer = round1Questions[currentQuestionIndex].answer;
    setIsAnswerCorrect(option === correctAnswer);
  };

  const nextQuestion = () => {
    setShowFeedback(true);
    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowFeedback(false);
    }, 3000);
  };

  const calculateRound1Score = () => {
    let newScore = 0;
    round1Questions.forEach((q, index) => {
      if (answers[index] === q.answer) newScore += 1;
    });
    return newScore;
  };

  const handleRound1Submit = async (isAuto = false) => {
    setShowFeedback(true);
    setTimeout(() => {
      setTimerActive(false);
      const finalScore = calculateRound1Score();
      setScore((prev) => ({ ...prev, round1: finalScore }));
      setIsSubmitted((prev) => ({ ...prev, round1: true }));
      setShowFeedback(false);

      const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}`;
      setIsLoading(true);
      fetch(`${baseUrl}leaderboard`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableNo: Number(tableNumber), score: finalScore, time: timeFormatted, round: "round1" }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((errorData) => {
              throw new Error(errorData.message);
            });
          }
          toast.success("Round 1 submitted successfully!");
        })
        .catch((error) => {
          console.error("Error updating leaderboard:", error);
          toast.error("Failed to submit Round 1 score");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 3000);
  };

  const checkTop10 = async () => {
    setIsLoading(true);
    try {
      const leaderboardResponse = await fetch(`${baseUrl}leaderboard`);
      const leaderboardData = await leaderboardResponse.json();
      const sortedRound1 = leaderboardData.round1.sort((a, b) => b.score - a.score).slice(0, 10);
      const top10Tables = sortedRound1.map((player) => player.tableNo);

      if (top10Tables.includes(Number(tableNumber))) {
        setIsTop10(true);
        setNotification("Congratulations! You have qualified for Round 2!");
        toast.success("Congratulations! You’ve qualified for Round 2!", { duration: 4000 });
        setShowTableVerification(true);
      } else {
        setNotification("Sorry, you didn't qualify for Round 2.");
        toast.error("Sorry, you didn’t qualify for Round 2.", { duration: 4000 });
      }
    } catch (error) {
      console.error("Error fetching leaderboard for top 10:", error);
      setNotification("Error fetching results. Please try again.");
      toast.error("Error fetching results");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTableVerification = () => {
    if (Number(tableInput) === Number(tableNumber)) {
      setCurrentRound("round2");
      setTimerActive(true);
      setTimeTaken(0);
      setRound2Data((prev) => ({ ...prev, locked: false }));
      setShowTableVerification(false);
      toast.success("Secret Code verified! Proceeding to Round 2...");
    } else {
      toast.error("Incorrect table number. Please try again.");
    }
  };

  const handleBoxFlip = async (box) => {
    if (attempts >= 2 || isSubmitted.round2) return;

    const newFlippedBoxes = [...flippedBoxes, box.id];
    setFlippedBoxes(newFlippedBoxes);
    setAttempts(attempts + 1);

    if (box.isCorrect) {
      setScore((prev) => ({ ...prev, round2: 5 }));
      setTimerActive(false);
      setIsSubmitted((prev) => ({ ...prev, round2: true }));

      const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}`;
      setIsLoading(true);
      try {
        await fetch(`${baseUrl}leaderboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableNo: Number(tableNumber), score: 5, time: timeFormatted, round: "round2" }),
        });
        toast.success("Round 2 submitted successfully!");
        toast.success("Great job! You won Round 2!", { duration: 4000 });
      } catch (error) {
        console.error("Error submitting Round 2:", error);
        toast.error("Failed to submit Round 2 score");
      } finally {
        setIsLoading(false);
      }
    } else if (attempts + 1 === 2) {
      setScore((prev) => ({ ...prev, round2: 0 }));
      setTimerActive(false);
      setIsSubmitted((prev) => ({ ...prev, round2: true }));

      const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}`;
      setIsLoading(true);
      try {
        await fetch(`${baseUrl}leaderboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableNo: Number(tableNumber), score: 0, time: timeFormatted, round: "round2" }),
        });
        toast.success("Round 2 submitted successfully!");
        toast.error("Oops! You lost Round 2.", { duration: 4000 });
      } catch (error) {
        console.error("Error submitting Round 2:", error);
        toast.error("Failed to submit Round 2 score");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleLeaderboardClick = () => {
    navigate("/leaderboard");
    toast("Loading leaderboard...", { duration: 2000 });
  };

  const totalQuestions = round1Questions.length;

  const getThankYouImage = () => {
    switch (currentQuestionIndex) {
      case 0:
        return thankYouImage1;
      case 1:
        return thankYouImage2;
      case 2:
        return thankYouImage3;
      default:
        return thankYouImage1; // Fallback
    }
  };

  const getWrongImage = () => {
    switch (currentQuestionIndex) {
      case 0:
        return wrongImage1;
      case 1:
        return wrongImage2;
      case 2:
        return wrongImage3;
      default:
        return wrongImage1; // Fallback
    }
  };

  const isAnswerSelected = () => {
    return answers[currentQuestionIndex] !== undefined;
  };

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
        position: "relative",
      }}
    >
      <Toaster position="top-right" />
      <div style={{ color: "white", paddingTop: "2%", fontSize: "30px" }}>
        Table {tableNumber} - {currentRound === "round1" ? "Round 1" : "Round 2"}
      </div>
      <h3 style={{ color: "white", marginTop: "27%", marginBottom: "2%", display: "flex", justifyContent: "center", alignItems: "center", gap: "5px" }}>
        <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img src={timerIcon} alt="Timer" style={{ width: "20px" }} />
        </span>{" "}
        <span style={{ fontSize: "30px" }}>{timeTaken}</span> sec
      </h3>

      {isLoading && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <img src={loadingGif} alt="Loading..." style={{ width: "100px" }} />
        </div>
      )}

      {notification && !isLoading && (
        <div
          style={{
            color: isTop10 ? "green" : "red",
            fontSize: "20px",
            margin: "20px",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {notification}
          {isSubmitted.round1 && currentRound === "round1" && !showTableVerification && countdown > 0 && (
            <p>
              Results in: {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}
            </p>
          )}
        </div>
      )}

      {currentRound === "round1" && !isSubmitted.round1 && round1Questions.length > 0 && !isLoading && (
        <>
          <div
            style={{
              display: showFeedback ? "none" : "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
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
                width: "90%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                margin: "20px",
                borderRadius: "20px",
                fontSize: "16px",
                boxShadow: "0 0 0 1px lightgray",
                backgroundColor: "white",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            >
              <p style={{ fontSize: "18px", fontWeight: "bold", padding: "20px" }}>
                {round1Questions[currentQuestionIndex].question}
              </p>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-evenly",
                  gap: "0px",
                  listStyleType: "none",
                  padding: "0",
                }}
              >
                {round1Questions[currentQuestionIndex].options.map((option, idx) => (
                  <li
                    key={idx}
                    onClick={() => handleAnswer(option)}
                    style={{
                      padding: "10px",
                      margin: "5px 0",
                      width: "34vw",
                      border: "2px solid white",
                      borderRadius: "10px",
                      cursor: "pointer",
                      background: "#fff",
                      backgroundColor: "#000",
                      color: "white",
                      scale: answers[currentQuestionIndex] === option ? 0.95 : 1,
                      boxShadow: answers[currentQuestionIndex] === option ? "0 0 0 2px green" : "none",
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ marginTop: "20px" }}>
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={nextQuestion}
                  disabled={!isAnswerSelected()}
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    backgroundColor: isAnswerSelected() ? "white" : "#cccccc",
                    borderRadius: "18px",
                    color: "black",
                    border: "none",
                    fontSize: "18px",
                    cursor: isAnswerSelected() ? "pointer" : "not-allowed",
                  }}
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={() => handleRound1Submit(false)}
                  disabled={!isAnswerSelected()}
                  style={{
                    padding: "10px",
                    paddingLeft: "20px",
                    paddingRight: "20px",
                    backgroundColor: isAnswerSelected() ? "white" : "#cccccc",
                    borderRadius: "18px",
                    fontSize: "18px",
                    color: "black",
                    border: "none",
                    cursor: isAnswerSelected() ? "pointer" : "not-allowed",
                  }}
                >
                  Submit
                </button>
              )}
            </div>
          </div>

          {showFeedback && (
            <div
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 10,
              }}
            >
              {isAnswerCorrect ? (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <img
                    src={getThankYouImage()}
                    alt="Thank you"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "70px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        height: "10px",
                        backgroundColor: "#106336",
                        borderRadius: "5px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "0%",
                          height: "100%",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          animation: "fillBar 3s linear forwards",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        position: "absolute",
                        color: "white",
                        fontSize: "16px",
                        marginBottom: "50px",
                      }}
                    >
                      Wait for <span style={{ fontSize: "26px" }}>{feedbackTimer > 1 ? "3" : "2"}</span> sec
                    </span>
                  </div>
                </div>
              ) : (
                <div style={{ position: "relative", width: "100%", height: "100%" }}>
                  <img
                    src={getWrongImage()}
                    alt="Wrong"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: "70px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "80%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      style={{
                        width: "70%",
                        height: "10px",
                        backgroundColor: "#106336",
                        borderRadius: "5px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: "0%",
                          height: "100%",
                          backgroundColor: "white",
                          borderRadius: "5px",
                          animation: "fillBar 3s linear forwards",
                        }}
                      />
                    </div>
                    <span
                      style={{
                        position: "absolute",
                        color: "white",
                        fontSize: "16px",
                        marginBottom: "50px",
                      }}
                    >
                      Wait for <span style={{ fontSize: "26px" }}>{feedbackTimer > 1 ? "3" : "2"}</span> sec
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}
          <style>
            {`
              @keyframes fillBar {
                from {
                  width: 0%;
                }
                to {
                  width: 100%;
                }
              }
            `}
          </style>
        </>
      )}

      {currentRound === "round1" && isSubmitted.round1 && !isTop10 && !notification.includes("Sorry") && !notification.includes("Congratulations") && !isLoading && (
        <div>
          <h2 style={{ color: "white" }}>Round 1 Score: {score.round1}</h2>
          <p style={{ color: "white" }}>Waiting for results...</p>
        </div>
      )}

      {currentRound === "round1" && isSubmitted.round1 && !isTop10 && notification.includes("Sorry") && !isLoading && (
        <div>
          <h2 style={{ color: "white" }}>Round 1 Score: {score.round1}</h2>
          <p style={{ color: "white" }}>Round 1 completed. Check leaderboard for results.</p>
          <button
            onClick={handleLeaderboardClick}
            style={{ padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", border: "none" }}
          >
            Check Leaderboard
          </button>
        </div>
      )}

      {currentRound === "round1" && isSubmitted.round1 && isTop10 && showTableVerification && !isLoading && (
        <div style={{ height: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h3 style={{ color: "white" }}>Verify Your Secret Number</h3>
          <input
            type="number"
            value={tableInput}
            onChange={(e) => setTableInput(e.target.value)}
            placeholder="Enter your Secret number"
            style={{
              padding: "10px",
              margin: "10px 0",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "200px",
              textAlign: "center",
            }}
          />
          <button
            onClick={handleTableVerification}
            style={{ padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", border: "none" }}
          >
            Verify
          </button>
        </div>
      )}

      {currentRound === "round2" && round2Data && !round2Data.locked && !isLoading && (
        <div style={{ height: "50%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <h3 style={{ color: "white" }}>Flip Game - Find the Correct Box! (Two Chances)</h3>
          <p style={{ color: "white" }}>Attempts Left: {2 - attempts}</p>
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
                  cursor: attempts >= 2 || isSubmitted.round2 ? "default" : "pointer",
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
              {score.round2 > 0 ? (
                <h2 style={{ color: "white", marginTop: "20px" }}>Round 2 Score: {score.round2}</h2>
              ) : (
                <h2 style={{ color: "red", marginTop: "20px" }}>You Lost!</h2>
              )}
              <button
                onClick={handleLeaderboardClick}
                style={{ padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", border: "none" }}
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

// Main App Component
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/welcome/:tableNumber" element={<Welcome />} />
        <Route path="/instruction/:tableNumber" element={<Instruction />} /> {/* New Instruction Route */}
        <Route path="/quiz/:tableNumber" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/" element={<Navigate to="/welcome/1" />} />
      </Routes>
    </Router>
  );
}