import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SideMenu from './components/side-menu.jsx'
import { routes } from './routing.jsx'
import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routes} />
  </StrictMode>,
)
