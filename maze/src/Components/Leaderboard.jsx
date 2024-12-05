import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import './Leaderboard.css';

const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Fetch leaderboard data
        Axios.get('http://localhost:3000/auth/leaderboard', { withCredentials: true })
            .then(response => {
                setLeaderboard(response.data);
            })
            .catch(err => {
                setError('Failed to load leaderboard.');
            });
    }, []);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="leaderboard-container">
            <h2>Leaderboard</h2>
            <table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard.map((user, index) => (
                        <tr key={index}>
                            <td>{user.rank}</td>
                            <td>{user.username}</td>
                            <td>{user.points}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Leaderboard;
