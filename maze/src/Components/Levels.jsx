import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Levels = () => {
  const navigate = useNavigate();

  // Example history questions
  const questions = [
    {
      id: 1,
      question: 'Who was the first President of the United States?',
      options: ['Abraham Lincoln', 'George Washington', 'Thomas Jefferson', 'John Adams'],
      answer: 'George Washington',
    },
    {
      id: 2,
      question: 'In what year did World War II end?',
      options: ['1945', '1939', '1918', '1963'],
      answer: '1945',
    },
    {
      id: 3,
      question: 'What was the name of the ship that brought the Pilgrims to America in 1620?',
      options: ['Santa Maria', 'Mayflower', 'HMS Victory', 'Titanic'],
      answer: 'Mayflower',
    },
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleAnswerClick = (selectedOption) => {
    if (selectedOption === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }

    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
    } else {
      setShowResult(true);
    }
  };

  const exitToHome = () => {
    navigate('/home');
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>History Quiz</h1>

      {showResult ? (
        <div>
          <h2>Your Score: {score}/{questions.length}</h2>
          <button
            onClick={exitToHome}
            style={{ padding: '10px 20px', fontSize: '16px', marginTop: '20px' }}
          >
            Exit
          </button>
        </div>
      ) : (
        <div>
          <h2>Question {currentQuestionIndex + 1}:</h2>
          <p>{questions[currentQuestionIndex].question}</p>
          <div>
            {questions[currentQuestionIndex].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerClick(option)}
                style={{
                  display: 'block',
                  margin: '10px auto',
                  padding: '10px 20px',
                  fontSize: '16px',
                  cursor: 'pointer',
                }}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            onClick={exitToHome}
            style={{
              padding: '10px 20px',
              fontSize: '16px',
              marginTop: '20px',
              backgroundColor: 'red',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Exit
          </button>
        </div>
      )}
    </div>
  );
};

export default Levels;
