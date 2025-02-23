import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import arrowG from "./arrowG.png";
import loadingGif from "./loading.gif";
import logo1 from './logo1.png'
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

  const handleVerify = () => {
    if (Number(tableInput) === Number(tableNumber)) {
      toast.success("Secret Code verified! Proceeding to Flip Game...");
      onVerify(true);
    } else {
      toast.error("Incorrect table number. Please try again.");
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

<img src={logo1} width={120} style={{ marginTop: "5%" }} />
    <div style={{color:"white",fontSize:"12px"}}>
      Target
    </div>
    <div style={{color:"white",fontSize:"12px"}}>
      Table Number:
    </div>
    <div style={{fontSize:"24px",color:"white"}}>
   <b>{tableNumber}</b> 
    </div>
    <div style={{color:"white",fontSize:"12px"}}>
      Go to the target table, Guess the correct Key code, Get it to your table
    </div>
      <h3 style={{ color: "white" }}>Verify Your Secret Number</h3>
      <input
        type="number"
        value={tableInput}
        onChange={(e) => setTableInput(e.target.value)}
        // placeholder="Enter your Secret number"
        style={{
          padding: "10px",
          margin: "10px 0",
  
          color:"white",
          fontSize:"16px",
          width: "200px",
          textAlign: "center",
          border: "none",
    borderBottom: "1px solid #46FF97",
    width: "200px",
    textAlign: "center",
    background: "transparent",
        }}
      />
      <button
        onClick={handleVerify}
        style={{
          padding: "10px",
          backgroundColor: "white",
          borderRadius: "14px",
          color: "black",
          border: "none",
          cursor: "pointer",
          borderRadius:"20px"
        }}
      >
        Verify
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

  return (
    <div
      style={{
        backgroundImage: "url('/round2game.png')",
        height: "100vh",
        width: "100vw",
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: "white",
        textAlign: "center",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
      }}
    >
      <Toaster position="top-right" />
      {isLoading ? (
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
          <img src={loadingGif} alt="Loading..." style={{ width: "100px" }} />
        </div>
      ) : (
        <>
          <h3 style={{ color: "white" }}>Flip Game - Find the Correct Box! (Two Chances)</h3>
          <p style={{ color: "white" }}>Attempts Left: {2 - attempts}</p>

          {/* Boxes positioned absolutely over the background */}
          {round2Data?.boxes.map((box, index) => (
            <div
              key={box.id}
              onClick={() => handleBoxFlip(box)}
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: flippedBoxes.includes(box.id) ? (box.isCorrect ? "green" : "red") : "#ccc",
                borderRadius: "5px",
                cursor: attempts >= 2 || isSubmitted ? "default" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                position: "absolute",
                top: `${1 * 80 + 10}%`, // Adjust these values as per your design
                left: `${1 * 80 + 10}%`, // Adjust these values as per your design
                transform: "translate(-50%, -50%)",
              }}
            >
              {flippedBoxes.includes(box.id) ? (box.isCorrect ? "✓" : "✗") : "?"}
            </div>
          ))}

          {isSubmitted && (
            <>
              {score > 0 ? (
                <h2 style={{ color: "white", marginTop: "20px" }}>Round 2 Score: {score}</h2>
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
        </>
      )}
    </div>
  );
}


// Main Round 2 Component
export default function Round2() {
  const { tableNumber } = useParams();
  const [step, setStep] = useState("instruction"); // "instruction", "verification", "game"
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
    if (verified) setStep("game");
  };

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
      {step === "game" && <Round2Game tableNumber={tableNumber} />}
    </>
  );
}