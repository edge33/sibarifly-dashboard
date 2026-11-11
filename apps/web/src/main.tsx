import React from 'react';
import ReactDOM from 'react-dom/client';
import AuthContextProvider from './authContext/AuthContextProvider';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
);
