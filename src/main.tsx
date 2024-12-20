import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './@app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <ToastContainer />
  </StrictMode>,
);
