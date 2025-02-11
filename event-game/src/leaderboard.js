const Leaderboard = ({ players }) => {
    const sortedPlayers = [...players]
      .sort((a, b) => b.score - a.score || a.time - b.time)
      .slice(0, 10); // Top 10 players
  
    return (
      <div className="p-6">
        <h2 className="text-lg font-bold text-center">Leaderboard</h2>
        <table className="w-full mt-4 border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 px-4 py-2">Rank</th>
              <th className="border border-gray-300 px-4 py-2">Table</th>
              <th className="border border-gray-300 px-4 py-2">Score</th>
              <th className="border border-gray-300 px-4 py-2">Time (s)</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map((player, index) => (
              <tr key={player.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{index + 1}</td>
                <td className="border border-gray-300 px-4 py-2">{player.name}</td>
                <td className="border border-gray-300 px-4 py-2">{player.score}</td>
                <td className="border border-gray-300 px-4 py-2">{player.time.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default Leaderboard