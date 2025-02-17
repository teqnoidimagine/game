import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useParams } from "react-router-dom";
// 🎉 Welcome Page Component
import arrowW from './arrowW.png';
import arrowG from './arrowG.png'
import { useHistory } from 'react-router-dom';
function Welcome() {
  const navigate = useNavigate();

  return (
    <div style={{ backgroundImage:"url('/welcome.png')",backgroundPosition:"center", backgroundSize: "cover",backgroundRepeat:"no-repeat",textAlign: "center", padding: "0%", backgroundColor: "#0c8240", height: "100vh", color: "white" }}>
      {/* <h1>Welcome to the Game!</h1> */}
      {/* <p>Get ready to play!</p> */}
      <button
        onClick={() => navigate("/quiz/3")}
        style={{ position:"absolute",bottom:"70px",left:"35%",padding: "10px 20px", fontSize: "16px", backgroundColor: "white", color: "black", border: "none", borderRadius: "5px", cursor: "pointer" }}
      >
        Start <span><img src={arrowG} width="35px"/></span>
      </button>
    </div>
  );
}

// 🏆 Leaderboard Component
function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);


  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("https://game-uaxu.onrender.com/leaderboard");
      const data = await response.json();

      const sortedData = data.sort((a, b) => (b.score === a.score ? a.time - b.time : b.score - a.score));

      setLeaderboard(sortedData);
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
    <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#0c8240", minHeight: "100vh", color: "black" }}>
      <h1 style={{color:"white"}}>Leaderboard</h1>
      <table
        style={{
          // width: "95%",
          // borderCollapse: "collapse",
          // backgroundColor: "#fff",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          // marginY:"10%",
          width:"100%",
          paddingTop:"15%",
          paddingBottom:"15%",
          backgroundImage:"url('/Union.png')",  backgroundSize: "cover",backgroundRepeat:"no-repeat",
        }}
      >
        <thead>
          <tr style={{ background:"none" }}>
            <th style={{ padding: "5px", fontSize: "14px" }}>Table No</th>
            <th style={{ padding: "5px", fontSize: "14px" }}>Score</th>
            <th style={{ padding: "5px", fontSize: "14px" }}>Time</th>
          </tr>
        </thead>
        <tbody style={{background:"none",marginBottom:"10px" }}>
          {leaderboard.map((player, index) => (
            <tr
              key={player.id}
              style={{
                // backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#e9ecef",
                transition: "background-color 0.3s",
              }}
            >
              <td
                style={{
                  padding: "5px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "12px",
                }}
              >
                Table {player.tableNo}
              </td>
              <td
                style={{
                  padding: "5px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "12px",
                }}
              >
                {player.score}
              </td>
              <td
                style={{
                  padding: "5px",
                  borderBottom: "1px solid #ddd",
                  fontSize: "12px",
                }}
              >
                {player.time}s
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// 📝 Quiz Component
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
      .then((data) => setQuestions(data.questions.slice(0, 3)))
      .catch((error) => console.error("Error fetching questions:", error));
  }, [tableNumber]);

  useEffect(() => {
    let timer;
    if (timerActive) {
      timer = setInterval(() => setTimeTaken((prevTime) => prevTime + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive]);

  const handleAnswer = (option) => {
    setAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
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

  const handleSubmit = () => {
    setTimerActive(false);
    const finalScore = calculateScore();
    setScore(finalScore);
    setIsSubmitted(true);
 
    fetch("https://game-uaxu.onrender.com/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tableNo: Number(tableNumber), score: finalScore, time: timeTaken }),
    }).catch((error) => console.error("Error updating leaderboard:", error));
  };
  const navigate = useNavigate();

  const handleLeaderboardClick = () => {
    navigate('/leaderboard'); // Navigate to '/leaderboard' route
  };

  return (
    <div style={{ backgroundImage:"url('/page2.png')",backgroundPosition:"center", backgroundSize: "cover",backgroundRepeat:"no-repeat",height:"100vh", padding: "20px", textAlign: "center", maxWidth: "600px", margin: "auto", borderRadius: "0px" }}>
      <h1 style={{ color: "white" }}> Table {tableNumber}</h1>
      <h3 style={{ color: "white" ,marginTop:"25%"}}>⏳ Time Taken: {timeTaken} sec</h3>
      {isSubmitted ? (
        <>
         <h2>Your final score: {score}</h2>
         
         <button   onClick={handleLeaderboardClick} style={{cursor:"pointer",border:"none", padding: "10px", backgroundColor: "#11C05E",borderRadius:"14px", color: "white",fontSize:"20px" }}>
              Check Leaderboard 
            </button>
        </>
       
      ) : questions.length > 0 ? (
        <div  style={{
          // width: "95%",
          // borderCollapse: "collapse",
          // backgroundColor: "#fff",
          // boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          // marginY:"10%",
          // width:"100%",
          height:"360px",
          justifyContent:"center",
          alignItems:"center",
          display:"flex",
          flexDirection:"column",
          // display
          // paddingTop:"15%",
          // paddingBottom:"15%",

          backgroundImage:"url('/Union.png')",  backgroundSize: "cover",backgroundRepeat:"no-repeat",
        }}>
          <h3>Calculation</h3>
          <p style={{ fontSize: "18px", fontWeight: "bold" }}>
            {currentQuestionIndex + 1}. {"    "} {questions[currentQuestionIndex].question}
          </p>
          <ul style={{ display:"flex",justifyContent:"space-evenly",gap:"10px", listStyleType: "none", padding: 0 }}>
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
                 {typeof option === "number" ? option.toFixed(2) : option}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ color: "white" }}>Loading questions...</p>
      )}

      {!isSubmitted && (
        <div style={{ marginTop: "20px" }}>
          {/* <button onClick={prevQuestion} disabled={currentQuestionIndex === 0} style={{ padding: "10px", marginRight: "10px", backgroundColor: "#007bff", color: "white" }}>
            Previous
          </button> */}
          {currentQuestionIndex === questions.length - 1 ? (
             <button onClick={handleSubmit}  style={{cursor:"pointer",border:"none", padding: "10px", backgroundColor: "#11C05E",borderRadius:"14px", color: "white",fontSize:"20px" }}>
           Submit
           </button>
          
          ) : (
            <button onClick={nextQuestion} style={{cursor:"pointer",border:"none", padding: "10px", backgroundColor: "#11C05E",borderRadius:"14px", color: "white",fontSize:"20px" }}>
              Next <span><img src={arrowW} width="35px"/></span>
            </button>
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
        <Route path="/" element={<Welcome />} />
        <Route path="/quiz/:tableNumber" element={<Quiz />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Router>
  );
}
