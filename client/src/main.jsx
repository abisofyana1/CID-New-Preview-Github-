import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { setupMockAdapter } from './mock/mockAdapter'

// Initialize Mock Adapter for live GitHub Pages demo and offline testing
setupMockAdapter();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

