import React from 'react';
import { BarChart2 } from 'lucide-react'; // Import your logo or an icon
import './LoadingScreen.css';  // Custom CSS for styling

const LoadingScreen: React.FC = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <BarChart2 className="logo-icon" />
        <h1 className="loading-message">Logging you in...</h1>
        <div className="spinner"></div> {/* Custom spinner animation */}
      </div>
    </div>
  );
};

export default LoadingScreen;