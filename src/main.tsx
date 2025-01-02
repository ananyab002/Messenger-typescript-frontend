import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChatMessagesContextProvider } from './context/ChatMessagesContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChatMessagesContextProvider>
      <App />
    </ChatMessagesContextProvider>
  </StrictMode>,
)
