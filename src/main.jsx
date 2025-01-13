import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Unit from './pages/unit.jsx'
import Home from './pages/home.jsx'
import Category from './pages/Category.jsx'
import Type from './pages/Type.jsx'
import Tagnumber from './pages/Tagnumber.jsx'
import Plo from './pages/Plo.jsx'
import Coi from './pages/Coi.jsx'
const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/unit',
    element: <Unit />,
  },
  {
    path: '/category',
    element: <Category />,
  },
  {
    path: '/type',
    element: <Type />,
  },
  {
    path: '/tagnumber',
    element: <Tagnumber />,
  },
  {
    path: '/plo',
    element: <Plo />,
  },
  {
    path: '/coi',
    element: <Coi />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)