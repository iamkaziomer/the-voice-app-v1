import React from 'react';
import { useAuth } from '../context/AuthContext';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import './PriorityIssue.css';

const PriorityIssue = ({ issue, rank, onUpvote }) => {
  const { user } = useAuth();

  const handleUpvoteClick = async () => {
    if (!user) {
      alert('Please login to upvote issues');
      return;
    }
    onUpvote(issue._id);
  };

  const getBackgroundOpacity = () => {
    if (rank === 1) return 1;
    if (rank === 2) return 0.85;
    if (rank === 3) return 0.7;
    return 0.5;
  };

  return (
    <div 
      className="priority-issue" 
      style={{ 
        '--background-opacity': getBackgroundOpacity(),
      }}
    >
      <div className="priority-issue-rank">{rank}</div>
      
      <div className="priority-issue-content">
        <div className="priority-issue-image">
          {issue.images?.length > 0 ? (
            <img src={issue.images[0]} alt={issue.title} />
          ) : (
            <div className="priority-issue-image-placeholder" />
          )}
        </div>

        <div className="priority-issue-details">
          <h3 className="priority-issue-title">{issue.title}</h3>
          <p className="priority-issue-description">{issue.description}</p>
          
          <div className="priority-issue-info">
            <div className="priority-issue-location">
              <LocationOnIcon />
              <div className="location-text">
                <span>{issue.colony}</span>
                <span className="pincode">{issue.pincode}</span>
              </div>
            </div>

            <div className="priority-issue-stats">
              <div className="upvote-count">
                {issue.upvotes?.count || 0}
              </div>
              <div className="concern-authority">
                {issue.concernAuthority}
              </div>
              <button 
                className="upvote-button"
                onClick={handleUpvoteClick}
              >
                upvote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriorityIssue;