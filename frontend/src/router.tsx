import { createBrowserRouter, Navigate } from 'react-router-dom';
// import { RotterdamDashboardPage } from './pages/RotterdamDashboardPage';
import { PietHeinPage } from './pages/PietHeinPage';
import { HistoricalMapPage } from './pages/HistoricalMapPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/map" replace />,
  },
  {
    path: '/map',
    element: <HistoricalMapPage />,
  },
  /* 
  {
    path: '/rotterdam',
    element: <RotterdamDashboardPage />,
  },
  */
  {
    path: '/characters/piet-hein',
    element: <PietHeinPage />,
  },
]);