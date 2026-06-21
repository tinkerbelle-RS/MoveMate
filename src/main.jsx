import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { LeaseProvider } from './context/LeaseContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <LeaseProvider>
        <App />
      </LeaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
