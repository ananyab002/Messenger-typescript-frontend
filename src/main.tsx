import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ChatMessagesContextProvider } from './context/ChatMessagesContext.tsx'
import { AuthContextProvider } from './context/AuthContext.tsx'
import { ChatIdContextProvider } from './context/ChatIdContext.tsx'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthContextProvider>
      <ChatMessagesContextProvider>
        <ChatIdContextProvider>
          <App />
        </ChatIdContextProvider>
      </ChatMessagesContextProvider>
    </AuthContextProvider>
  </React.StrictMode>,
)
