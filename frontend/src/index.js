import React from 'react';
import ReactDOM from 'react-dom/client'; // <-- Keep this line
import './css/recipestyle.css'; // <-- Import the CSS file here
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
