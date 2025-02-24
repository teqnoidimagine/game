import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import arrowG from "./arrowG.png";
import loadingGif from "./loading.gif";
import logo1 from './logo1.png';
import loc from './loc.png';
const baseUrl = "https://dccbackend.vercel.app/";

// Round 2 Instruction Component
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

// Round 2 Verification Component


function Round2Verification({ onVerify, tableNumber }) {
  const [tableInput, setTableInput] = useState("");
  const [message, setMessage] = useState("");

  // Complete verification data list
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

  // Get data for the current table number
  const currentData = verificationData[tableNumber] || {
    targetTable: 1,
    verificationCode: "0000",
  }; // Fallback if tableNumber is invalid

  const handleVerify = () => {
    if (tableInput === currentData.verificationCode) {
      setMessage("Verification Code correct! Proceeding to next step...");
      setTimeout(() => {
        onVerify(true); // Proceed after a short delay
      }, 1000); // 1-second delay
    } else {
      setMessage("Error, please enter the correct code");
      setTableInput(""); // Clear input on error
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
        Your Table Number: {tableNumber}
      </div>
      <div style={{ color: "white", fontSize: "14px" }}>
        Target Table Number: {currentData.targetTable}
      </div>
      <div style={{ fontSize: "36px", color: "white", marginTop: "10px" }}>
        <b>{currentData.verificationCode}</b>
      </div>
      <div style={{ color: "white", fontSize: "14px", width: "60%", marginTop: "20%" }}>
        Go to Target Table {currentData.targetTable}, find the 4-digit Verification Code, and enter it here.
      </div>
      <h3 style={{ color: "white", fontSize: "12px", marginTop: "15%" }}>
        Enter the code:
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
// Round 2 Intermission Component (New)
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
       Let's Go
      </button>
    </div>
  );
}


// Round 2 Flip Game Component
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
        toast.success("Great job! You won Round 2!", { duration: 4000 });
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

  // Define box positions along the snake's body (adjust these percentages based on your image)
  const boxPositions = [
    { top: "17%", left: "15%" }, // Top-left curve of the snake
    { top: "32%", left: "86%" }, // Middle of the first curve
    { top: "55%", left: "11%" }, // Middle of the straight section
    { top: "70%", left: "50%" }, // Bottom of the second curve
    { top: "84%", left: "70%" }, // End of the snake
  ];

  return (
    <div
      style={{
        backgroundImage: "url('/round2game.png')",
        height: "100vh",
        // width: "100vw",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        // position: "relative",
      }}
    >
      <Toaster position="top-right" />
      {isLoading ? (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <img src={loadingGif} alt="Loading..." style={{ width: "100px" }} />
        </div>
      ) : (
        <>
          {/* <h3 style={{ color: "white" }}>Flip Game - Find the Correct Box! (Two Chances)</h3> */}
          {/* Replace Attempts Left with Hearts in the top-right corner */}
          <div
            style={{
              position: "absolute",
              top: "6%", // Adjust to position near the top-right corner
              right: "20px", // Adjust to position near the top-right corner
              fontSize: "24px", // Larger hearts for visibility
              color: "red", // Heart color
            }}
          >
            {Array.from({ length: 2 - attempts }, (_, index) => (
              <span key={index}>❤️</span>
            ))}
          </div>

          {/* Boxes positioned along the snake's body */}
          {round2Data?.boxes.map((box, index) => (
            <div
              key={box.id}
              onClick={() => handleBoxFlip(box)}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: flippedBoxes.includes(box.id) ? (box.isCorrect ? "green" : "red") : "#17A046",
                borderRadius: "5px",
                cursor: attempts >= 2 || isSubmitted ? "default" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                borderRadius: "50px",
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

          {isSubmitted && (
            <>
              {score > 0 ? (
                <h2 style={{ color: "white", marginTop: "20px" }}>You Won & Round 2 Score: {score}</h2>
              ) : (
                <h2 style={{ color: "red", marginTop: "20px" }}>You Lost!</h2>
              )}
              {/* <button
                onClick={handleLeaderboardClick}
                style={{ padding: "10px", backgroundColor: "#11C05E", borderRadius: "14px", color: "white", border: "none" }}
              >
                Check Leaderboard
              </button> */}
            </>
          )}
        </>
      )}
    </div>
  );
}


// Main Round 2 Component
export default function Round2() {
  const { tableNumber } = useParams();
  const [step, setStep] = useState("instruction"); // "instruction", "verification", "intermission", "game"
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
    if (verified) setStep("intermission"); // Move to intermission after verification
  };
  const handleProceedToGame = () => setStep("game"); // Proceed to game from intermission

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

  if (!isWinner) return null; // Redirect handled in useEffect

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