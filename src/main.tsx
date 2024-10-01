import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="dev-5kd8usx4erhfbios.jp.auth0.com"
    clientId="znCozKtsm8xj9cga8M1kpOb7UpFJtNX5"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
    audience="https://dev-5kd8usx4erhfbios.jp.auth0.com/api/v2/" // Update this if needed
    scope="read:current_user update:current_user_metadata"
  >
    <StrictMode>
      <App />
    </StrictMode>
  </Auth0Provider>
);