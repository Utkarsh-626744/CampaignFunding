import React from 'react';
import ReactDOM from 'react-dom';

import App from './App';
import Web3Provider from './context/Web3Context';
import { BrowserRouter } from 'react-router-dom';
import { StateContextProvider } from './context/index'; // Your StateContext
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root

root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Web3Provider>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Web3Provider>
    </BrowserRouter>
  </React.StrictMode>
);