import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Flow from './components/Pages/Workflows/Workflow';
import NavigationBar from './components/NavigationBar/NavigationBar';
import HeadNavigationBar from './components/NavigationBar/HeadNavigationBar';
import TemplatePage from './components/Pages/TemplatePage/TemplatePage';
import RunTemplate from './components/Pages/RunTemplate/RunTemplate';
import Login from './components/Pages/Auth/Login';
import SignUp from './components/Pages/Auth/Signup';
import { AuthProvider } from './contexts/AuthContext';
import RequireAuth from './contexts/RequireAuth';
import { CodeEditor } from './components/Pages/Lambdas/CodeEditor';
import LambdasPage from './components/Pages/Lambdas/LambdasPage';

// Layout component for pages that share common elements like NavigationBar and HeadNavigationBar
function MainLayout() {
  return (
    <div className="App">
      {/*<HeadNavigationBar />*/}
      <Container fluid>
        <Row>
          <Col xs="auto" className="p-0">
            <NavigationBar />
          </Col>
          <Col className="p-4">
            {/* Outlet is where the nested route components will be rendered */}
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
}

// Define the routes using createBrowserRouter
const router = createBrowserRouter([
  {
    element: <MainLayout />, // Use MainLayout for authenticated users
    children: [
      {
        element: <RequireAuth />, // Protect child routes
        children: [
          {
            path: "/", // Default route
            element: <Flow />,
            errorElement: <div>404 Page Not Found</div>
          },
          {
            path: "/templates",
            element: <TemplatePage />,
          },
          {
            path: "/run/:id",
            element: <RunTemplate />,
            errorElement: <div>404 Page Not Found</div>
          },
          {
            path: "/lambdas",
            element: <LambdasPage />,
          }
        ],
      },
    ],
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <SignUp /> },
]);


function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}


export default App;