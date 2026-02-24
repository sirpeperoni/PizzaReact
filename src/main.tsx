import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './app/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <RouterProvider
          router={router}
      />
  </StrictMode>,
)
