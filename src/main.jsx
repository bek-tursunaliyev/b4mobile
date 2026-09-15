import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import ConfigError from './components/ConfigError.jsx'
import { isSupabaseConfigured } from './lib/supabaseClient'
import { initTelegramApp } from './lib/telegram'

initTelegramApp()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      {isSupabaseConfigured ? <App /> : <ConfigError />}
    </ErrorBoundary>
  </StrictMode>,
)
