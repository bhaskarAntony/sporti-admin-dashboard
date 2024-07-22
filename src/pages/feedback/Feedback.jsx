import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch feedback submissions from the backend when the component mounts
    axios.get('http://localhost:5000/api/feedback')
      .then(response => {
        setFeedbacks(response.data);
      })
      .catch(error => {
        console.error('Error fetching feedback submissions:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-8 offset-md-2">
          <h2>All Feedback Submissions</h2>
          <ul className="list-group mt-3">
            {feedbacks.map((feedback, index) => (
              <li key={index} className="list-group-item">
                <strong>Submitted by:</strong> {feedback.fullName}<br />
                <strong>Email:</strong> {feedback.emailAddress}<br />
                <strong>Sport:</strong> {feedback.sport}<br />
                <strong>Subject:</strong> {feedback.subject}<br />
                <strong>Message:</strong> {feedback.message}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
