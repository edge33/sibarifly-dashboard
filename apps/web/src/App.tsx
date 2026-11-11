import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { useAuthContext } from './authContext/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Auth/Login';
import ErrorPage from './pages/ErrorPage';
import Event from './pages/Event/Event';
import EventManager from './pages/Private/EventManager';
import EventSummary from './pages/Private/EventSummary/EventSummary';

const AuthenticatedRoute = ({ children }: { children: React.ReactElement }) => {
  const { authenticated } = useAuthContext();

  if (!authenticated) {
    return <Navigate to="/auth" replace />;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Event /> },
      {
        path: 'events/:eventId?',
        element: <EventSummary />,
      },
      {
        path: '/auth',
        element: <Login />,
      },
      {
        path: '/manage',
        element: (
          <AuthenticatedRoute>
            <EventManager />
          </AuthenticatedRoute>
        ),
      },
    ],
  },
  {
    path: '/*',
    element: (
      <Layout>
        <ErrorPage />
      </Layout>
    ),
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
