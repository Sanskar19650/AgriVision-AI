import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerServiceWorker } from './services/offlineMapService';

// Initialize offline GIS Service Worker
registerServiceWorker();

createRoot(document.getElementById('root')!).render(<App />);
