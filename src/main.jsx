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
import Skhp from './pages/Skhp.jsx';
import DashboardSkhp from './components/skhp/DashboardSkhp.jsx';
import AddSkhp from './components/skhp/AddSkhp.jsx';
import EditSkhp from './components/skhp/EditSkhp.jsx';
import ReportPlo from './components/plo/ReportPlo.jsx';
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
    path: '/skhp',
    element: (
      <ProtectedRoute>
        <Skhp />
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
    path: '/skhp/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardSkhp />
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
  {
    path: '/skhp/tambah',
    element: (
      <ProtectedRoute>
        <AddSkhp />
      </ProtectedRoute>
    ),
  },
  {
    path: '/skhp/edit/:id',
    element: (
      <ProtectedRoute>
        <EditSkhp />
      </ProtectedRoute>
    ),
  },
  {
    path: '/plo/report/:id',
    element: (
      <ProtectedRoute>
        <ReportPlo />
      </ProtectedRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
