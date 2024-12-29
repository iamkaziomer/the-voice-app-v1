import React, { useState, useEffect } from 'react';
import IssueCard from '../components/issueCard';
import Header from '../components/Header';
function HomePage() {
  const [issues, setIssues] = useState([]);  // State to store issues

  // Fetch issues from backend when the component is mounted
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/issues'); // Your backend API URL
        if (response.ok) {
          const data = await response.json();  // Parse the JSON data
          setIssues(data);  // Set issues to the state
        } else {
          console.error('Failed to fetch issues');
        }
      } catch (error) {
        console.error('Error fetching issues:', error);
      }
    };

    fetchIssues();  // Call the fetch function
  }, []);  // Empty dependency array, so it only runs once on component mount

  return (
    <div>
      <Header/>
      <h1>Issues</h1>
      <div className='cardContainer'>
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueCard key={issue._id} issue={issue} /> // Pass each issue to IssueCard
          ))
        ) : (
          <p>No issues found</p>  // Display a message if no issues are found
        )}
      </div>
    
    </div>
  );
}

export default HomePage;
