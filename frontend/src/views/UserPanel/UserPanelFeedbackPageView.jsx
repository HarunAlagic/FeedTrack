import React, { useState } from 'react';
import '../../Feedback.css';
import '../../App.css';
import feedtrackLogo from "./../../assets/feedtrackLogoBlack.svg";

const FeedbackPage = () => {
    const [satisfactionLevel, setSatisfactionLevel] = useState(null);
  
    const handleSmileyClick = (level) => {
      setSatisfactionLevel(level);
    };
  
    const sendFeedback = async () => {
      if (satisfactionLevel !== null) {
        // Sending feedback to the server
        console.log('Feedback sent successfully:', satisfactionLevel);
      } else {
        alert("Please select a satisfaction level")
        console.log('Please select a satisfaction level.');
      }
    };
  
    return (
      <div>
      <div className="logo">
        <img src={feedtrackLogo} className="logo" alt="FeedTrack logo" />
      </div>
      <div>
        <h2>Your feedback:</h2>
        <h3>What is your opinion about the service? </h3>
        <SmileyFeedback onClick={handleSmileyClick} />
        <button onClick={sendFeedback}>Submit</button>
      </div>
      </div>
    );
  };
  
const handleSmileyClick = (level) => {
    setSatisfactionLevel(level);
  };
  

const SmileyFeedback = ({ satisfactionLevel, onClick }) => {
    const smileys = [
      { level: 1, color: 'red', symbol: '😡' },
      { level: 2, color: 'orange', symbol: '😐' },
      { level: 3, color: 'yellow', symbol: '😊' },
      { level: 4, color: 'lightgreen', symbol: '😃' },
      { level: 5, color: 'green', symbol: '😍' },
    ];
  
    return (
      <div className="smiley-feedback">
        {smileys.map((smiley) => (
          <span
            key={smiley.level}
            style={{ color: smiley.color, cursor: 'pointer', fontSize: '2em', marginRight: '0px', padding: '15px' }}
            onClick={() => onClick(smiley.level)}
          >
            {smiley.symbol}
          </span>
        ))}
      </div>
    );
  };
  

export default FeedbackPage;
