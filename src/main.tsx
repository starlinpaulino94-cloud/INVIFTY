import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { LanguageProvider } from './context/LanguageContext.tsx';
import { SelectionProvider } from './context/SelectionContext.tsx';
import { initAnalytics } from './services/analytics';

initAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <SelectionProvider>
        <App />
      </SelectionProvider>
    </LanguageProvider>
  </StrictMode>,
);

