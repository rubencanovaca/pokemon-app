/**
 * Application entry point
 * Renders the root App component into the DOM with React StrictMode
 */
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
