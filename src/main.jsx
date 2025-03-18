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
import ProtectedRoute from './ProtectedRoute.jsx';
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
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <ProtectedRoute />, // Jadi parent route yang diproteksi
    children: [
      { index: true, element: <Home /> },
      { path: '/user', element: <User /> },
      { path: '/unit', element: <Unit /> },
      { path: '/category', element: <Category /> },
      { path: '/type', element: <Type /> },
      { path: '/tagnumber', element: <Tagnumber /> },
      { path: '/plo', element: <Plo /> },
      { path: '/coi', element: <Coi /> },
      { path: '/skhp', element: <Skhp /> },
      { path: '/plo/dashboard', element: <DashboardPlo /> },
      { path: '/coi/dashboard', element: <DashboardCoi /> },
      { path: '/skhp/dashboard', element: <DashboardSkhp /> },
      { path: '/plo/tambah', element: <AddPlo /> },
      { path: '/plo/edit/:id', element: <EditPlo /> },
      { path: '/coi/tambah', element: <AddCoi /> },
      { path: '/coi/edit/:id', element: <EditCoi /> },
      { path: '/skhp/tambah', element: <AddSkhp /> },
      { path: '/skhp/edit/:id', element: <EditSkhp /> },
      { path: '/plo/report/:id', element: <ReportPlo /> },
    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
