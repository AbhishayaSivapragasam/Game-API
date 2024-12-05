import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Cover.css'; // CSS file for custom styles

const Cover= () => {
  const navigate = useNavigate();

  const handleStartGame = () => {
    navigate('/login');
  };

  return (
    <div className="cover-page">
      <button className="start-button" onClick={handleStartGame}>
        Start Game
      </button>
    </div>
  );
};

export default Cover;
