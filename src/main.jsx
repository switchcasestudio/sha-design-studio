import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
// Self-hosted Google Fonts (Fontsource) — referenced by --font-display / --font-hero tokens
import '@fontsource-variable/fredoka';
import '@fontsource/bagel-fat-one';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
