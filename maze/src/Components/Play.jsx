import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './play.css';

const Play = () => {
  const initialTimer = 60;
  const [countdown, setCountdown] = useState(initialTimer);
  const [gameData, setGameData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [message, setMessage] = useState('');
  const [showOptions, setShowOptions] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [username, setUsername] = useState(null); // Added username state
  const apiUrl = 'https://marcconrad.com/uob/banana/api.php';
  const navigate = useNavigate();

  const fetchGameData = async () => {
    try {
      const response = await axios.get(apiUrl);
      if (response.data) {
        setGameData(response.data);
      } else {
        setGameData({ message: 'No game data available.' });
      }
      setIsLoading(false);
      setMessage('');
      setShowOptions(true);
    } catch (error) {
      console.error('Error fetching game data:', error);
      setError('Failed to fetch game data');
      setIsLoading(false);
    }
  };

  const savePoints = async () => {
    try {
      await axios.post(
        'http://localhost:3000/auth/save-points',
        { points: score },
        { withCredentials: true } // Send cookies for authentication
      );
      console.log('Points saved successfully');
    } catch (error) {
      console.error('Error saving points:', error);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:3000/auth/profile', { withCredentials: true });
        setUsername(response.data.username); // Set username from response
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setError('Failed to fetch user profile');
      }
    };

    fetchUserProfile();
    fetchGameData(); // Fetch the first question
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setMessage('Game Over!');
          setShowOptions(false);
          savePoints(); // Save points when the game ends
          setTimeout(() => {
            navigate('/home');
          }, 2000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate, score]);

  const handleAnswer = (selectedAnswer) => {
    if (!showOptions) return;

    setShowOptions(false);
    if (selectedAnswer === gameData.solution) {
      setMessage('Correct Answer!');
      setScore((prev) => prev + 10);
    } else {
      setMessage('Wrong Answer!');
    }

    setTimeout(() => {
      fetchGameData();
    }, 1000);
  };

  if (isLoading) {
    return <div>Loading game data...</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="image-container">
  <img src="/5405317.jpg" alt="Background" className="image-background" />


      <audio autoPlay loop muted={isMuted}>
        <source src="/audio.mp3" type="audio/mp3" />
        Your browser does not support the audio tag.
      </audio>

      <button className="music-toggle" onClick={() => setIsMuted((prev) => !prev)}>
        {isMuted ? 'Unmute Music' : 'Mute Music'}
      </button>

      <div className="game-container">
        <p>Time remaining: {countdown} seconds&nbsp;&nbsp;Score: {score} </p>
        {message && <p className="feedback-message">{message}</p>}
        <div>
          <h3>Question:</h3>
          <img src={gameData.question} alt="Game Question" />
        </div>
        {showOptions && (
          <div className="answer-options">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button key={num} onClick={() => handleAnswer(num)}>
                {num}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Play;
