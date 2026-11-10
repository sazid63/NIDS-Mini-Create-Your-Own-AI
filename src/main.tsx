import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import '@fontsource-variable/bricolage-grotesque/wght.css';
import '@fontsource/atkinson-hyperlegible-next/400.css';
import '@fontsource/atkinson-hyperlegible-next/600.css';
import '@fontsource/atkinson-hyperlegible-next/700.css';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/700.css';
import './index.css';

createRoot(document.getElementById('root')!).render(<App />);
