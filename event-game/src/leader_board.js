import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  // Function to fetch leaderboard data
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch("http://localhost:5000/leaderboard");
      const data = await response.json();
      setLeaderboard(data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    }
  };

  useEffect(() => {
    fetchLeaderboard(); // Fetch initially
    const interval = setInterval(fetchLeaderboard, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Leaderboard</h1>
      <table border="1" style={{ margin: "auto", width: "50%" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((player) => (
            <tr key={player.id}>
              <td>{player.name}</td>
              <td>{player.score}</td>
              <td>{player.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Quiz({ tableNumber }) {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <h1>Math Quiz - Table {tableNumber}</h1>
      <p>Questions will be displayed here.</p>
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
            <Link key={i} to={`/quiz/table${i + 1}`} style={{ marginLeft: "10px" }}>
              Table {i + 1}
            </Link>
          ))}
        </nav>
        <Routes>
          <Route path="/leaderboard" element={<Leaderboard />} />
          {[...Array(24).keys()].map((i) => (
            <Route
              key={i}
              path={`/quiz/table${i + 1}`}
              element={<Quiz tableNumber={i + 1} />}
            />
          ))}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
