import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CSVLink } from 'react-csv';

function Feedback() {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    // Fetch feedback submissions from the backend when the component mounts
    axios.get('https://sporti-backend-live-p00l.onrender.com/api/feedbacks')
      .then(response => {
        setFeedbacks(response.data.data);
      })
      .catch(error => {
        console.error('Error fetching feedback submissions:', error);
      });
  }, []); // Empty dependency array ensures the effect runs only once

  const headers = [
    { label: "Officer's Name", key: "username" },
    { label: "Email", key: "email" },
    { label: "Subject", key: "subject" },
    { label: "Message", key: "message" },
    { label: "SPORTI", key: "sporti" },
];

  return (
    <div className="container-fluid vh-100 bg-light p-3 p-md-5 feedback">
      <div className="row">
        <div className="col-md-8 offset-md-2">
         <div className="border-0 bg-white p-3">
        <div className="d-flex align-items-center justify-content-between">
        <h2>All Feedback Submissions</h2>
         <CSVLink
                        data={feedbacks}
                        headers={headers}
                        filename={`feedback_data.csv`}
                        className="main-btn"
                    >
                        <i class="bi bi-download"></i> Download Data
                    </CSVLink>
        </div>
          <ul className="list-group mt-3">
            {feedbacks?.map((feedback, index) => (
              <li key={index} className="list-group-item">
                <strong>Submitted by:</strong> {feedback.username}<br />
                <strong>Email:</strong> {feedback.email}<br />
                <strong>Sport:</strong> {feedback.sporti}<br />
                <strong>Subject:</strong> {feedback.subject}<br />
                <strong>Message:</strong> {feedback.message}
              </li>
            ))}
          </ul>
         </div>
        </div>
      </div>
    </div>
  );
}

export default Feedback;
