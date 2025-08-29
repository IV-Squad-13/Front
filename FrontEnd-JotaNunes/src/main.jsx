import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import { makeServer } from './mirage/server.js';

const VITE_CLIENT_ENVIRONMENT = import.meta.env.VITE_CLIENT_ENVIRONMENT;

if (VITE_CLIENT_ENVIRONMENT === 'TEST_CLIENT') {
  makeServer();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
