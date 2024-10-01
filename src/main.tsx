import React from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';

// This function will handle where the user should be redirected after login
const onRedirectCallback = (appState?: any) => {
  window.history.replaceState(
    {},
    document.title,
    appState?.returnTo || window.location.pathname
  );
};

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="dev-5kd8usx4erhfbios.jp.auth0.com"
    clientId="znCozKtsm8xj9cga8M1kpOb7UpFJtNX5"
    authorizationParams={{
      redirect_uri: window.location.origin,  // window.location.origin should be enough
      // Optionally add scope if needed
      scope: 'openid profile email',  // Basic scope needed for user profile
    }}
    onRedirectCallback={onRedirectCallback}
  >
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </Auth0Provider>
);