import './staticApi';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {AppShell} from '@alphabette/shell';
import '@alphabette/shell/style.css';
import App from './App.tsx';
import './index.css';

/** Identité de l'application dans la double barre Alphabette (DON, BIG…). */
const APP = {
  key: 'oeil-atelier',
  name: "L'Œil de l'Atelier",
  tagline: 'Des outils pour créer, exposer et vendre votre art',
  accent: '#9c7d2b',
};
import { LanguageProvider } from './i18n/LanguageContext.js';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <AppShell app={APP}>
        <App />
      </AppShell>
    </LanguageProvider>
  </StrictMode>,
);

