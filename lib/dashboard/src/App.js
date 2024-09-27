import './App.css';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

import Flow from './components/Workflows/Workflow';
import NavigationBar from './components/NavigationBar/NavigationBar';
import HeadNavigationBar from './components/NavigationBar/HeadNavigationBar';
import TemplatePage from './components/Pages/TemplatePage/TemplatePage';
import RunTemplate from './components/Pages/RunTemplate/RunTemplate';

// Layout component for pages that share common elements like NavigationBar and HeadNavigationBar
function MainLayout() {
  return (
    <div className="App">
      <HeadNavigationBar />
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
    element: <MainLayout />, // Use MainLayout as the parent route
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
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;