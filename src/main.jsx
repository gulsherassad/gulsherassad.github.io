import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Latin subsets only: the site's text is English. Instrument Serif regular is
// also preloaded from index.html, as the hero headline is set in it.
import '@fontsource/instrument-serif/latin-400.css';
import '@fontsource/instrument-serif/latin-400-italic.css';
import '@fontsource/geist-sans/latin-400.css';
import '@fontsource/geist-sans/latin-500.css';
import '@fontsource/geist-mono/latin-400.css';
import './styles/reset.css';
import './styles/tokens.css';
import './styles/global.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
