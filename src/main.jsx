import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Login from './pages/Login.jsx';
import Unit from './pages/Unit.jsx';
import Home from './pages/Home.jsx';
import Category from './pages/Category.jsx';
import Type from './pages/Type.jsx';
import Tagnumber from './pages/Tagnumber.jsx';
import Plo from './pages/Plo.jsx';
import Coi from './pages/Coi.jsx';
import AddPlo from './components/plo/AddPlo.jsx';
import EditPlo from './components/plo/EditPlo.jsx';
import AddCoi from './components/coi/AddCoi.jsx';
import EditCoi from './components/coi/EditCoi.jsx';
import ProtectedRoute from './protectedRoute.jsx';
import User from './pages/User.jsx';
import DashboardPlo from './components/plo/DashboardPlo.jsx';
import DashboardCoi from './components/coi/DashboardCoi.jsx';
const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute>
        <User />
      </ProtectedRoute>
    ),
  },
  {
    path: '/unit',
    element: (
      <ProtectedRoute>
        <Unit />
      </ProtectedRoute>
    ),
  },
  {
    path: '/category',
    element: (
      <ProtectedRoute>
        <Category />
      </ProtectedRoute>
    ),
  },
  {
    path: '/type',
    element: (
      <ProtectedRoute>
        <Type />
      </ProtectedRoute>
    ),
  },
  {
    path: '/tagnumber',
    element: (
      <ProtectedRoute>
        <Tagnumber />
      </ProtectedRoute>
    ),
  },
  {
    path: '/plo',
    element: (
      <ProtectedRoute>
        <Plo />
      </ProtectedRoute>
    ),
  },
  {
    path: '/coi',
    element: (
      <ProtectedRoute>
        <Coi />
      </ProtectedRoute>
    ),
  },
  {
    path: '/plo/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPlo />
      </ProtectedRoute>
    ),
  },
  {
    path: '/coi/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardCoi />
      </ProtectedRoute>
    ),
  },
  {
    path: '/plo/tambah',
    element: (
      <ProtectedRoute>
        <AddPlo />
      </ProtectedRoute>
    ),
  },
  {
    path: '/plo/edit/:id',
    element: (
      <ProtectedRoute>
        <EditPlo />
      </ProtectedRoute>
    ),
  },
  {
    path: '/coi/tambah',
    element: (
      <ProtectedRoute>
        <AddCoi />
      </ProtectedRoute>
    ),
  },
  {
    path: '/coi/edit/:id',
    element: (
      <ProtectedRoute>
        <EditCoi />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
