import React from 'react';
import ReactDOM from 'react-dom/client';
import { inject } from '@vercel/analytics';
// Self-hosted fonts: no request to Google, works offline and in every region.
import '@fontsource-variable/inter/wght.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource-variable/roboto-condensed/wght.css';
import '@fontsource-variable/roboto-mono/wght.css';
import App from './App';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Could not find root element to mount to');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Privacy-friendly, cookie-less visit counts. Off by default. To turn it on: enable "Analytics"
// in the Vercel project dashboard, then add the environment variable VITE_ANALYTICS=1 and redeploy.
if (import.meta.env.PROD && import.meta.env.VITE_ANALYTICS === '1') inject();
