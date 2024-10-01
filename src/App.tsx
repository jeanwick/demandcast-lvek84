import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';  // Adjust the path as per your project structure
import DemandForecast from './demandforecast';   // Adjust the path as per your project structure

// Component to require authentication for specific routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const location = window.location.pathname;  // Capture the current location

  if (!isAuthenticated) {
    loginWithRedirect({
      appState: {
        returnTo: location,  // Redirect the user back to the correct page after login
      },
    });
    return null;  // Return null to avoid rendering anything while redirecting
  }

  return children;  // Render the children if authenticated
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public Route: Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Protected Route: Demand Forecast */}
        <Route
          path="/demandforecast"
          element={
            <RequireAuth>
              <DemandForecast />
            </RequireAuth>
          }
        />

        {/* Fallback Route: Redirect unknown paths to the Landing Page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;