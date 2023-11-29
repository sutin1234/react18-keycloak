import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import KeycloakProvider from "./context/keycloakContext.tsx";
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* <ReactKeycloakProvider authClient={keycloakInstance}> */}
    <KeycloakProvider>
      <App />
    </KeycloakProvider>

    {/* </ReactKeycloakProvider> */}
  </React.StrictMode>,
)
