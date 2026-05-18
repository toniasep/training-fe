import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import UsersPage from './app/users/page.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <UsersPage />
  </StrictMode>,
)
