import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';  // Adjust the path as per your project structure
import DemandForecast from './demandforecast';   // Adjust the path as per your project structure

// Component to require authentication for specific routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = window.location.pathname;

  if (isLoading) {
    // Display a loading state while checking the user's authentication status
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // If the user is not authenticated, trigger login and store the current page they were trying to access
    loginWithRedirect({
      appState: {
        returnTo: location,  // Redirect back to the intended page after successful login
      },
    });
    return null;  // Render nothing while redirecting
  }

  // If the user is authenticated, render the protected content
  return children;
};

// Handle the callback from Auth0 after login
const CallbackHandler: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;  // Show loading while Auth0 processes login
  }

  if (isAuthenticated) {
    return <Navigate to="/demandforecast" />;  // Default to demandforecast after login
  }

  // Redirect to landing page if something goes wrong or authentication fails
  return <Navigate to="/" />;
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

        {/* Handle the callback route explicitly */}
        <Route path="/callback" element={<CallbackHandler />} />

        {/* Fallback Route: Redirect unknown paths to the Landing Page */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;