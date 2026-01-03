
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';
import SetupRedux from './setupRedux';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SetupRedux>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SetupRedux>
  </StrictMode>
);
