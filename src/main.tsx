import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import './index.css';
import './styles/fonts.css';
import './styles/typography.css'; // Import typography adjustments
import './styles/size-override.css'; // Override Tailwind font sizes
import './styles/section-titles.css'; // Standardized section title styling

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
);