import { createBrowserRouter, Navigate } from 'react-router-dom';
// import { RotterdamDashboardPage } from './pages/RotterdamDashboardPage';
import { PietHeinPage } from './pages/PietHeinPage';
import { WitteDeWithPage } from './pages/WitteDeWithPage';
import { HistoricalMapPage } from './pages/HistoricalMapPage';
import { ErrorPage } from './pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to="/map" replace />,
      },
      {
        path: 'map',
        element: <HistoricalMapPage />,
      },
      /* 
      {
        path: 'rotterdam',
        element: <RotterdamDashboardPage />,
      },
      */
      {
        path: 'characters/piet-hein',
        element: <PietHeinPage />,
      },
      {
        path: 'characters/witte-de-with',
        element: <WitteDeWithPage />,
      },
    ],
  },
]);