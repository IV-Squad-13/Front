import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './styles/global.css';
import { makeServer } from './mirage/server.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';

const CLIENT_ENVIRONMENT = import.meta.env.VITE_CLIENT_ENVIRONMENT;
export const API_URL = CLIENT_ENVIRONMENT === 'TEST_CLIENT' ? '/mock/' : import.meta.env.VITE_API_URL;
console.log('API_URL:', API_URL);
console.log(import.meta.env.VITE_API_URL);

if (CLIENT_ENVIRONMENT === 'TEST_CLIENT') {
  console.log('Starting Mirage mock server...');
  makeServer();
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
);
