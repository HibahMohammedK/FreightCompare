import React from 'react';
import { createRoot } from 'react-dom/client';
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "sonner";
import { App } from './App';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import './index.css';


const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Provider store={store}>
          <App />
          <Toaster
            position="top-right"
            richColors
            closeButton
          />
        </Provider>
      </GoogleOAuthProvider>
    </React.StrictMode>
  );
}