import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Confetti from "react-confetti"; // Import react-confetti
import arrowG from "./arrowG.png";
import loadingGif from "./loading.gif";
import logo1 from "./logo1.png";
import loc from "./loc.png";
const baseUrl = "https://dccbackend.vercel.app/";

// Round 2 Instruction Component (unchanged)
function Round2Instruction({ onProceed }) {
  return (
    <div
      style={{
        backgroundImage: "url('/round2Inss.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
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
        onClick={onProceed}
        style={{
          position: "absolute",
          bottom: "12vh",
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

// Round 2 Verification Component (unchanged)
function Round2Verification({ onVerify, tableNumber }) {
  const [tableInput, setTableInput] = useState("");
  const [message, setMessage] = useState("");

  const verificationData = {
    1: { targetTable: 12, verificationCode: "1923" },
    2: { targetTable: 19, verificationCode: "4512" },
    3: { targetTable: 7, verificationCode: "7894" },
    4: { targetTable: 15, verificationCode: "2367" },
    5: { targetTable: 18, verificationCode: "9103" },
    6: { targetTable: 1, verificationCode: "3548" },
    7: { targetTable: 13, verificationCode: "6721" },
    8: { targetTable: 20, verificationCode: "1089" },
    9: { targetTable: 4, verificationCode: "5432" },
    10: { targetTable: 16, verificationCode: "8765" },
    11: { targetTable: 3, verificationCode: "3214" },
    12: { targetTable: 17, verificationCode: "6547" },
    13: { targetTable: 9, verificationCode: "9871" },
    14: { targetTable: 6, verificationCode: "2436" },
    15: { targetTable: 11, verificationCode: "5678" },
    16: { targetTable: 8, verificationCode: "8901" },
    17: { targetTable: 14, verificationCode: "1357" },
    18: { targetTable: 2, verificationCode: "3421" },
    19: { targetTable: 5, verificationCode: "4323" },
    20: { targetTable: 10, verificationCode: "7654" },
  };

  const currentData = verificationData[tableNumber] || {
    targetTable: 1,
    verificationCode: "0000",
  };

  const handleVerify = () => {
    if (tableInput === currentData.verificationCode) {
      setMessage("Verification Code correct! Proceeding to next step...");
      setTimeout(() => {
        onVerify(true);
      }, 1000);
    } else {
      setMessage("Error, please enter the correct code");
      setTableInput("");
    }
  };

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgb(33 141 82) 0%, rgb(7 92 46) 25%, rgb(5 82 39) 50%, rgb(12 35 22) 100%)",
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
      <img src={logo1} width={120} style={{ marginTop: "-30%" }} />
      <div style={{ color: "white", fontSize: "14px", marginTop: "20%" }}>
        Target Table Number: {currentData.targetTable}
      </div>
      <div style={{ color: "white", fontSize: "14px", width: "60%", marginTop: "20%" }}>
        Go to the Target Table {currentData.targetTable}, Guess the correct Key code, Get it to your table 
      </div>
      <h3 style={{ color: "white", fontSize: "12px", marginTop: "15%" }}>
        Write the code here:
      </h3>
      <input
        type="number"
        value={tableInput}
        onChange={(e) => setTableInput(e.target.value)}
        style={{
          padding: "10px",
          margin: "10px 0",
          color: "white",
          fontSize: "16px",
          width: "200px",
          textAlign: "center",
          border: "none",
          borderBottom: "1px solid #46FF97",
          background: "transparent",
        }}
        placeholder="Enter 4-digit code"
      />
      {message && (
        <div
          style={{
            color: message.includes("Error") ? "#FF6347" : "#46FF97",
            fontSize: "14px",
            marginTop: "10px",
            fontWeight: "bold",
          }}
        >
          {message}
        </div>
      )}
      <button
        onClick={handleVerify}
        style={{
          padding: "10px 20px",
          backgroundColor: "white",
          borderRadius: "20px",
          color: "black",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        Verify
      </button>
    </div>
  );
}

// Round 2 Intermission Component (unchanged)
function Round2Intermission({ onProceed }) {
  return (
    <div
      style={{
        backgroundImage: "url('/interm.png')",
        backgroundPosition: "center",
        backgroundSize: "cover",
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
        onClick={onProceed}
        style={{
          position: "absolute",
          bottom: "12vh",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "white",
          color: "black",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Let's Go
      </button>
    </div>
  );
}

// New Win Screen Component
function WinScreen({ score, onLeaderboardClick }) {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgb(33 141 82) 0%, rgb(7 92 46) 25%, rgb(5 82 39) 50%, rgb(12 35 22) 100%)",
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
      <Confetti width={window.innerWidth} height={window.innerHeight} /> {/* Confetti effect */}
      <h1 style={{ fontSize: "48px", color: "#46FF97" }}>Congratulations! You Won!</h1>
      <p style={{ fontSize: "24px", margin: "20px 0" }}>Round 2 Score: {score}</p>
      <p style={{ fontSize: "18px", color: "#FFD700" }}>*Party time! Celebrate your victory!*</p>
      <button
        onClick={onLeaderboardClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#11C05E",
          borderRadius: "14px",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        Check Leaderboard
      </button>
    </div>
  );
}

// New Lose Screen Component
function LoseScreen({ onLeaderboardClick }) {
  return (
    <div
      style={{
        backgroundImage: "linear-gradient(rgb(33 141 82) 0%, rgb(7 92 46) 25%, rgb(5 82 39) 50%, rgb(12 35 22) 100%)",
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
      <h1 style={{ fontSize: "48px", color: "#FF6347" }}>Oops! You Lost!</h1>
      <p style={{ fontSize: "24px", margin: "20px 0" }}>Better luck next time!</p>
      <button
        onClick={onLeaderboardClick}
        style={{
          padding: "10px 20px",
          backgroundColor: "#11C05E",
          borderRadius: "14px",
          color: "white",
          border: "none",
          cursor: "pointer",
          fontSize: "16px",
          marginTop: "20px",
        }}
      >
        Check Leaderboard
      </button>
    </div>
  );
}

// Updated Round 2 Game Component
function Round2Game({ tableNumber }) {
  const [round2Data, setRound2Data] = useState(null);
  const [flippedBoxes, setFlippedBoxes] = useState([]);
  const [attempts, setAttempts] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timerActive, setTimerActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRound2Data = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${baseUrl}quiz/table${tableNumber}`);
        const data = await response.json();
        setRound2Data(data.round2 || { locked: false, boxes: [] });
      } catch (error) {
        console.error("Error fetching Round 2 data:", error);
        toast.error("Failed to load Round 2 data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRound2Data();
  }, [tableNumber]);

  useEffect(() => {
    let timer;
    if (timerActive && !isSubmitted) {
      timer = setInterval(() => setTimeTaken((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [timerActive, isSubmitted]);

  const handleBoxFlip = async (box) => {
    if (attempts >= 2 || isSubmitted) return;

    const newFlippedBoxes = [...flippedBoxes, box.id];
    setFlippedBoxes(newFlippedBoxes);
    setAttempts(attempts + 1);

    if (box.isCorrect) {
      setScore(5);
      setTimerActive(false);
      setIsSubmitted(true);

      const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}`;
      setIsLoading(true);
      try {
        await fetch(`${baseUrl}leaderboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableNo: Number(tableNumber), score: 5, time: timeFormatted, round: "round2" }),
        });
        toast.success("Round 2 submitted successfully!");
      } catch (error) {
        console.error("Error submitting Round 2:", error);
        toast.error("Failed to submit Round 2 score");
      } finally {
        setIsLoading(false);
      }
    } else if (attempts + 1 === 2) {
      setScore(0);
      setTimerActive(false);
      setIsSubmitted(true);

      const timeFormatted = `${Math.floor(timeTaken / 60)}:${(timeTaken % 60).toString().padStart(2, "0")}`;
      setIsLoading(true);
      try {
        await fetch(`${baseUrl}leaderboard`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tableNo: Number(tableNumber), score: 0, time: timeFormatted, round: "round2" }),
        });
        toast.success("Round 2 submitted successfully!");
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

  const boxPositions = [
    { top: "22%", left: "20%" },
    { top: "36%", left: "66%" },
    { top: "61%", left: "22%" },
    { top: "72%", left: "60%" },
    { top: "86%", left: "49%" },
  ];

  return (
    <div
      style={{
        height: "100vh",
        color: "white",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // Added position relative to container
      }}
    >
      <img 
        src="/gamebg1.png"
        alt="Game background"
        style={{
          position: "relative",
          maxWidth: "100%",
          maxHeight: "100%",
          // objectFit: "contain",
        }}
      />
      <Toaster position="top-right" />
      {isLoading ? (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <img src={loadingGif} alt="Loading..." style={{ width: "100px" }} />
        </div>
      ) : isSubmitted ? (
        score > 0 ? (
          <WinScreen score={score} onLeaderboardClick={handleLeaderboardClick} />
        ) : (
          <LoseScreen onLeaderboardClick={handleLeaderboardClick} />
        )
      ) : (
        <>
          <div
            style={{
              position: "absolute",
              top: "10%",
              left: "20px",
              fontSize: "24px",
              color: "red",
              textAlign: "left"
            }}
          >
            <div style={{color: "white", fontSize: "16px"}}>Chances Left:</div>
            {Array.from({ length: 3 - attempts }, (_, index) => (
              <span key={index}>❤️</span>
            ))}
          </div>

          {round2Data?.boxes.map((box, index) => (
            <div
              key={box.id}
              onClick={() => handleBoxFlip(box)}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: flippedBoxes.includes(box.id) ? (box.isCorrect ? "green" : "red") : "white",
                borderRadius: "50px",
                cursor: attempts >= 2 || isSubmitted ? "default" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                position: "absolute",
                border: "2px solid #3DE577",
                top: boxPositions[index]?.top,
                left: boxPositions[index]?.left,
                transform: "translate(-50%, -50%)",
              }}
            >
              {flippedBoxes.includes(box.id) ? (box.isCorrect ? "DCC" : "✗") : <img src={loc} width="16px" />}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

// Main Round 2 Component (unchanged)
export default function Round2() {
  const { tableNumber } = useParams();
  const [step, setStep] = useState("instruction");
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isWinner, setIsWinner] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWinner = async () => {
      try {
        const response = await fetch(`${baseUrl}leaderboard`);
        const data = await response.json();
        const sortedRound1 = data.round1.sort((a, b) => b.score - a.score).slice(0, 10);
        const top10Tables = sortedRound1.map((player) => player.tableNo);
        if (top10Tables.includes(Number(tableNumber))) {
          setIsWinner(true);
        } else {
          toast.error("You are not authorized to access Round 2.");
          navigate("/leaderboard");
        }
      } catch (error) {
        console.error("Error checking winner status:", error);
        toast.error("Error verifying access. Redirecting...");
        navigate("/leaderboard");
      } finally {
        setIsLoading(false);
      }
    };
    checkWinner();
  }, [tableNumber, navigate]);

  const handleProceedToVerification = () => setStep("verification");
  const handleVerificationSuccess = (verified) => {
    if (verified) setStep("intermission");
  };
  const handleProceedToGame = () => setStep("game");

  if (isLoading) {
    return (
      <div
        style={{
          backgroundImage: "linear-gradient(rgb(33 141 82) 0%, rgb(7 92 46) 25%, rgb(5 82 39) 50%, rgb(12 35 22) 100%)",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img src={loadingGif} alt="Loading..." style={{ width: "100px" }} />
      </div>
    );
  }

  if (!isWinner) return null;

  return (
    <>
      {step === "instruction" && <Round2Instruction onProceed={handleProceedToVerification} />}
      {step === "verification" && (
        <Round2Verification onVerify={handleVerificationSuccess} tableNumber={tableNumber} />
      )}
      {step === "intermission" && <Round2Intermission onProceed={handleProceedToGame} />}
      {step === "game" && <Round2Game tableNumber={tableNumber} />}
    </>
  );
}