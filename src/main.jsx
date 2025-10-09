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
import Contract from './pages/Contract.jsx';
import AddContract from './components/contract/addContract.jsx';
import EditContract from './components/contract/EditContract.jsx';
import DashboardContract from './components/contract/DashboardContract.jsx';
import AddSpk from './components/contract/AddSpk.jsx';
import EditSpk from './components/contract/EditSpk.jsx';
import AddAmandemen from './components/contract/amandemen/AddAmandemen.jsx';
import EditAmandemen from './components/contract/amandemen/EditAmandemen.jsx';
import MonitoringContract from './components/contract/MonitoringContract.jsx';
import HistoricalMemorandum from './pages/HistoricalMemorandum.jsx';
import AddHistoricalMemorandum from './components/historical/AddHistoricalMemorandum.jsx';
import EditHistoricalMemorandum from './components/historical/EditHistoricalMemorandum.jsx';
import LampiranMemo from './components/historical/LampiranMemo.jsx';
import EngineeringData from './pages/EngineeringData.jsx';
import Datasheet from './components/engineering_data/Datasheet.jsx';
import Ga_Drawing from './components/engineering_data/Ga_Drawing.jsx';
import AddEngineeringData from './components/engineering_data/AddEngineeringData.jsx';
import EditEngineeringData from './components/engineering_data/EditEngineeringData.jsx';
import Features from './pages/Features.jsx';
import NewLogin from './pages/NewLogin.jsx';
import LogActivities from './pages/LogActivities.jsx';
import LogUser from './components/log_activity/LogUser.jsx';
import LaporanInspection from './pages/LaporanInspection.jsx';
import DetailLaporan from './components/laporan_inspection/DetailLaporan.jsx';
import Moc from './pages/Moc.jsx';
import AddMoc from './components/moc/addMoc.jsx';
import EditMoc from './components/moc/EditMoc.jsx';
import ReadinessMaterial from './pages/ReadinessMaterial.jsx';
import ReadinessJasa from './pages/ReadinessJasa.jsx';
import Readiness from './pages/Readiness.jsx';
import { ActivityProvider } from './utils/ActivityContext.jsx';
import DashboardReadiness from './pages/DashboardReadiness.jsx';
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/newlogin',
    element: <NewLogin />,
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
      { path: '/contract', element: <Contract /> },
      { path: '/features/:id', element: <Features /> },
      { path: '/historical_memorandum', element: <HistoricalMemorandum /> },
      { path: '/engineering_data', element: <EngineeringData /> },
      { path: '/plo/dashboard', element: <DashboardPlo /> },
      { path: '/plo/tambah', element: <AddPlo /> },
      { path: '/plo/edit/:id', element: <EditPlo /> },
      { path: '/plo/report/:id', element: <ReportPlo /> },
      { path: '/coi/dashboard', element: <DashboardCoi /> },
      { path: '/coi/tambah', element: <AddCoi /> },
      { path: '/coi/edit/:id', element: <EditCoi /> },
      { path: '/skhp/dashboard', element: <DashboardSkhp /> },
      { path: '/skhp/tambah', element: <AddSkhp /> },
      { path: '/skhp/edit/:id', element: <EditSkhp /> },
      { path: '/contract/tambah', element: <AddContract /> },
      { path: '/contract/edit/:id', element: <EditContract /> },
      { path: '/contract/dashboard/:id', element: <DashboardContract /> },
      { path: '/contract/addspk/:id', element: <AddSpk /> },
      { path: '/contract/editspk/:id/:spk_id', element: <EditSpk /> },
      { path: '/contract/addamandemen/:id', element: <AddAmandemen /> },
      { path: '/contract/editamandemen/:id/:amandemen_id', element: <EditAmandemen /> },
      { path: '/contract/monitoring', element: <MonitoringContract /> },
      { path: '/historical_memorandum/tambah', element: <AddHistoricalMemorandum /> },
      { path: '/historical_memorandum/edit/:id', element: <EditHistoricalMemorandum /> },
      { path: '/historical_memorandum/lampiran/:id', element: <LampiranMemo /> },
      { path: '/engineering_data/ga_drawing/:id', element: <Ga_Drawing /> },
      { path: '/engineering_data/datasheet/:id', element: <Datasheet /> },
      { path: '/engineering_data/tambah', element: <AddEngineeringData /> },
      { path: '/engineering_data/edit/:id', element: <EditEngineeringData /> },
      { path: '/log_activity', element: <LogActivities /> },
      { path: '/log_activity/user/:id', element: <LogUser /> },
      { path: '/laporan_inspection', element: <LaporanInspection /> },
      { path: '/laporan_inspection/details/:id', element: <DetailLaporan /> },
      { path: '/moc', element: <Moc /> },
      { path: '/moc/tambah', element: <AddMoc /> },
      { path: '/moc/edit/:id', element: <EditMoc /> },
      { path: '/readiness_ta_plantstop_material/:event_readiness_id', element: <ReadinessMaterial /> },
      { path: '/readiness_ta_plantstop_jasa/:event_readiness_id', element: <ReadinessJasa /> },
      { path: '/readiness_ta_plantstop', element: <Readiness /> },
      { path: '/dashboard_readiness_ta_plantstop/:id', element: <DashboardReadiness /> },


    ],
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ActivityProvider>
      <RouterProvider router={router} />
    </ActivityProvider>
  </StrictMode>
);
