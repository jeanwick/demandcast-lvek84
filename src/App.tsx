import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';  // Adjust this path as per your project structure
import DemandForecast from './demandforecast';// Adjust this path as per your project structure

// Component to require authentication for specific routes
const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  if (!isAuthenticated) {
    loginWithRedirect();  // Trigger login flow if not authenticated
    return null;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/demandforecast"
          element={
            <RequireAuth>
              <DemandForecast />
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;