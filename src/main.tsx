import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error(
    "Mount failed: Required DOM element with id 'root' is missing from the document structure."
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);


