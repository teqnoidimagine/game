import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
} from "react-router-dom";

const generateQuestions = () => {
  const operations = ["+", "-", "×"];
  return Array.from({ length: 25 }, (_, i) => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = operations[Math.floor(Math.random() * operations.length)];
    const answer =
      operation === "+"
        ? num1 + num2
        : operation === "-"
        ? num1 - num2
        : num1 * num2;
    const options = [
      answer,
      answer + Math.floor(Math.random() * 3) + 1,
      answer - Math.floor(Math.random() * 3) - 1,
      answer + Math.floor(Math.random() * 6) - 3,
    ].sort(() => Math.random() - 0.5);
    return {
      id: i + 1,
      question: `${num1} ${operation} ${num2}`,
      correctAnswer: answer,
      options,
    };
  });
};

const initialPlayers = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  score: 0,
  time: 0,
  hasAnswered: false,
}));

const Leaderboard = ({ players }) => {
  return (
    <div className="fixed top-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded shadow-lg w-80">
      <h2 className="text-lg font-bold mb-2">Leaderboard</h2>
      <ul>
        {players.sort((a, b) => b.score - a.score || a.time - b.time).map((player) => (
          <li key={player.id} className="border-b p-2">
            {player.name} - Score: {player.score}, Time: {player.time}s
          </li>
        ))}
      </ul>
    </div>
  );
};

const QuestionPage = ({ questions, submitAnswer, round, qualifiedPlayers }) => {
  const { tableId } = useParams();
  const tableIdNum = parseInt(tableId, 10);
  const question = questions.find((q) => q.id === round);
  const isQualified = qualifiedPlayers.includes(tableIdNum);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [timeTaken, setTimeTaken] = useState(0);
  const [timer, setTimer] = useState(null);

  useEffect(() => {
    if (!question) return;
    const startTime = Date.now();
    const interval = setInterval(() => {
      setTimeTaken(((Date.now() - startTime) / 1000).toFixed(2));
    }, 100);
    setTimer(interval);
    return () => clearInterval(interval);
  }, [question]);

  const handleAnswer = (answer) => {
    if (!question || selectedAnswer !== null) return;
    clearInterval(timer);
    setSelectedAnswer(answer);
    const correct = answer === question.correctAnswer;
    setIsCorrect(correct);
    submitAnswer(correct, parseFloat(timeTaken), tableIdNum);
  };

  if (!isQualified && round > 1) {
    return (
      <div className="p-6 text-center text-xl">
        You are out of the competition.
      </div>
    );
  }

  return (
    <div className="p-6 text-center">
      {!selectedAnswer ? (
        <>
          <h2 className="text-lg font-bold">Your Question:</h2>
          <p className="text-xl mt-2">{question?.question}</p>
          <div className="mt-4">
            {question?.options.map((option, index) => (
              <button
                key={index}
                className="px-4 py-2 m-2 bg-blue-500 text-white rounded"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <p className="mt-4">Time Taken: {timeTaken}s</p>
        </>
      ) : (
        <>
          <h2 className="text-lg font-bold">
            {isCorrect ? "✅ Correct! Wait for others." : "❌ Incorrect! You are out."}
          </h2>
        </>
      )}
    </div>
  );
};

const QuizGame = () => {
  const questions = generateQuestions();
  const [players, setPlayers] = useState(initialPlayers);
  const [round, setRound] = useState(1);
  const [qualifiedPlayers, setQualifiedPlayers] = useState(players.map((p) => p.id));
  const [allAnswered, setAllAnswered] = useState(false);

  useEffect(() => {
    setAllAnswered(players.every((player) => player.hasAnswered));
  }, [players]);

  const submitAnswer = (correct, timeTaken, id) => {
    setPlayers((prev) => {
      const updatedPlayers = prev.map((player) =>
        player.id === id
          ? { ...player, score: correct ? player.score + 1 : player.score, time: timeTaken, hasAnswered: true }
          : player
      );
      return updatedPlayers;
    });
  };

  const nextRound = () => {
    setQualifiedPlayers(
      players.sort((a, b) => b.score - a.score || a.time - b.time).slice(0, 10).map((p) => p.id)
    );
    setPlayers(players.map((p) => ({ ...p, hasAnswered: false })));
    setRound(round + 1);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<div className="text-center p-6 text-xl">Waiting for next round...</div>} />
        <Route path="/table/:tableId" element={<QuestionPage questions={questions} submitAnswer={submitAnswer} round={round} qualifiedPlayers={qualifiedPlayers} />} />
      </Routes>
      {allAnswered && <button onClick={nextRound} className="fixed bottom-4 right-4 px-6 py-2 bg-green-500 text-white rounded">Next Round</button>}
      <Leaderboard players={players} />
    </Router>
  );
};

export default QuizGame;
