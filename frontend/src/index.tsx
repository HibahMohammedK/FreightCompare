import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import './index.css';


const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
}