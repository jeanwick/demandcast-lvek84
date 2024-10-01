import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';

// This function will handle where the user should be redirected after login
const onRedirectCallback = (appState?: any) => {
  // Redirect the user to where they were before login, or to /demandforecast by default
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || '/demandforecast'  // Default to /demandforecast if no returnTo value exists
  );
};

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="dev-5kd8usx4erhfbios.jp.auth0.com"
    clientId="znCozKtsm8xj9cga8M1kpOb7UpFJtNX5"
    authorizationParams={{
      redirect_uri: window.location.origin + '/callback',  // Make sure this matches the Vercel app's URL
      // audience: "demandcastauth", // Replace with your API Audience
      scope: 'openid profile email',  // Request basic scopes (adjust as needed)
    }}
    onRedirectCallback={onRedirectCallback}  // Handle redirection after login
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);