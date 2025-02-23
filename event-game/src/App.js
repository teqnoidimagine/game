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
import logo1 from "./logo1.png";
import Round2 from "./Round2"; // Import Round 2 component

// const baseUrl = "https://localhost:5000/"
const baseUrl = "https://dccbackend.vercel.app/";

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
        onClick={() => navigate(`/instruction/${tableNumber}`)}
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

// Instruction Page Component (for Round 1)
function Instruction() {
  const navigate = useNavigate();
  const { tableNumber } = useParams();

  return (
    <div
      style={{
        backgroundImage: "url('/instBg.png')",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#13954D",
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
      <ul
        style={{
          listStyleType: "none",
          padding: "0",
          fontSize: "16px",
          textAlign: "center",
          maxWidth: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <li style={{ marginBottom: "10px", width: "80%" }}>
          The mission is to find 3 pet friends who lost in the jungle and they left some clues that you have to crack and find them
        </li>
      </ul>
      <button
        onClick={() => navigate(`/quiz/${tableNumber}`)}
        style={{
          position: "absolute",
          bottom: "22vh",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
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

// Quiz Component (Round 1 Only)
function Quiz() {
  const { tableNumber } = useParams();
  const [round1Questions, setRound1Questions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState({ round1: 0 });
  const [isSubmitted, setIsSubmitted] = useState({ round1: false });
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [feedbackTimer, setFeedbackTimer] = useState(3); // Added feedbackTimer state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuizData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}quiz/table${tableNumber}`);
        const data = await response.json();
        setRound1Questions(data.round1 || round1Questions);
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
    if (timerActive && !isSubmitted.round1) {
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
  }, [timerActive, isSubmitted.round1]);

  useEffect(() => {
    let feedbackInterval;
    if (showFeedback) {
      setFeedbackTimer(3); // Reset timer to 3 seconds
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
          // setNotification("Round 1 completed. Check leaderboard for results.");
        })
        .catch((error) => {
          console.error("Error updating leaderboard:", error);
          toast.error("Failed to submit Round 1 score");
          setNotification("Error submitting score. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, 3000);
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
        return thankYouImage1;
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
        return wrongImage1;
    }
  };

  const isAnswerSelected = () => {
    return answers[currentQuestionIndex] !== undefined;
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgb(33 141 82) 0%, rgb(7 92 46) 25%, rgb(5 82 39) 50%, rgb(12 35 22) 100%)",
        height: "100vh",
        padding: "0px",
        textAlign: "center",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <Toaster position="top-right" />
      {isLoading && (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <img src={loadingGif} alt="Loading..." style={{ width: "100px" }} />
        </div>
      )}

      {notification && !isLoading && (
        <div
          style={{
            color: "white",
            fontSize: "20px",
            // backgroundColor: "rgba(255, 255, 255, 0.8)",
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          {/* {notification} */}
        </div>
      )}

      {!isSubmitted.round1 && round1Questions.length > 0 && !isLoading && (
        <>
          <div
            style={{
              display: showFeedback ? "none" : "flex",
              flexDirection: "column",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
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
                marginBottom: "5px",
                borderRadius: "20px",
                fontSize: "16px",
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
              }}
            >
              <img src={logo1} width={120} style={{ marginTop: "5%" }} />
              <p style={{ color: "#5CFFA4", textAlign: "center", width: "70%", fontSize: "12px", marginTop: "10%" }}>
                Crack the clue<br />to find the missing paw
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "end",
                  margin: "5px",
                  borderBottom: "1px",
                  width: "85vw",
                  borderBottom: "1px solid green",
                  marginTop: "7%",
                }}
              >
                <div>
                  <p style={{ color: "white", margin: "5px", backgroundColor: "#089449", padding: "5px 10px", borderRadius: "20px", fontSize: "12px" }}>
                    Clue {currentQuestionIndex + 1}
                  </p>
                </div>
                <p style={{ color: "white", marginBottom: "2%", display: "flex", justifyContent: "center", alignItems: "end", gap: "2px" }}>
                  <span style={{ display: "fle", justifyContent: "center", alignItems: "center" }}>
                    <img src={timerIcon} alt="Timer" style={{ width: "10px" }} />
                  </span>{" "}
                  <span style={{ fontSize: "20px" }}>{timeTaken}</span> s
                </p>
              </div>
              <p style={{ margin: 0, fontSize: "18px", fontWeight: "bold", padding: "10px", paddingBottom: "20px", textAlign: "left", color: "white" }}>
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
                      padding: "12px",
                      margin: "5px 0",
                      width: "30vw",
                      border: "1px solid #2D9059",
                      borderRadius: "15px",
                      cursor: "pointer",
                      color: "white",
                      fontSize: "14px",
                      backgroundColor: answers[currentQuestionIndex] === option ? "#009043" : "",
                      boxShadow: answers[currentQuestionIndex] === option ? "0 0 0 2px green" : "none",
                    }}
                  >
                    {option}
                  </li>
                ))}
              </ul>
              <p style={{ color: "#5CFFA4", textAlign: "center", width: "70%", fontSize: "12px" }}>Select the correct answer</p>
            </div>
            <div style={{ marginTop: "0px" }}>
              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  onClick={nextQuestion}
                  disabled={!isAnswerSelected()}
                  style={{
                    padding: "10px",
                    paddingLeft: "25px",
                    paddingRight: "25px",
                    backgroundColor: isAnswerSelected() ? "white" : "#6BA37E",
                    borderRadius: "38px",
                    color: "black",
                    border: "none",
                    fontSize: "14px",
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
                    paddingLeft: "25px",
                    paddingRight: "25px",
                    backgroundColor: isAnswerSelected() ? "white" : "#6BA37E",
                    borderRadius: "38px",
                    fontSize: "14px",
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

      {isSubmitted.round1 && !isLoading && (
        <div style={{ backgroundImage: "" }}>
          <img src={logo1} width={120} style={{ marginTop: "5%" }} />
          <div style={{ fontSize: "46px", color: "#51FF9D", fontWeight: "semibold",marginTop:"25%" }}>Congrats</div>
          <p style={{color:"white",margin:"0px",fontSize:"12px"}}>You finshed the <b>Round 1</b></p>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <p style={{width:"60%",height:"1px",backgroundColor:"green",alignItems:"center",}}></p></div>
          <div style={{ color: "white" ,margin:"0px",fontSize:"12px"}}>Found {score.round1} lost Paws in the jungle</div>
          <div style={{ color: "white" ,margin:"0px",fontSize:"12px"}}>in {score.time} Seconds</div>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
          <p style={{width:"100%",height:"40px",margin:"30px 0px",fontSize:"12px",backgroundColor:"#0A7F3F",color:"white",display:"flex",justifyContent:"center",alignItems:"center"}}>
           <div>Please Wait</div> 
            </p></div>
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
            <p style={{color:"#4EFF9C",width:"50%",margin:"0px",fontSize:"12px"}}>We’ll announce the top tables list selected for <b>Round 2</b>, at the end of <b>Round 1</b></p></div> 
          <p style={{ color: "white" }}>{notification}</p>
          {/* <button
            onClick={handleLeaderboardClick}
            style={{ padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", border: "none" }}
          >
            Check Leaderboard
          </button> */}
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
        <Route path="/instruction/:tableNumber" element={<Instruction />} />
        <Route path="/quiz/:tableNumber" element={<Quiz />} />
        <Route path="/round2/:tableNumber" element={<Round2 />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/" element={<Navigate to="/welcome/1" />} />
      </Routes>
    </Router>
  );
}