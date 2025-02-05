import './App.css';
import React, { useState } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import { Box } from '@mui/material';

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
import ChatComponent from './components/Pages/Chat/Chat';
import WorkflowTrace from './components/Pages/Tracer/WorkflowTrace';
import Home from './components/Pages/Home/Home';

// Layout component for pages that share common elements like NavigationBar and HeadNavigationBar
function MainLayout() {
  const [sideBarIsCollapsed, setSideBarIsCollapsed] = useState(true);
  const sideBarWidth = 240;
  
  return (
    <div className="App">
      <Box sx={{ display: 'flex' }}>
        <NavigationBar  
          isCollapsed={sideBarIsCollapsed} setIsCollapsed={setSideBarIsCollapsed}
          sideBarWidth={sideBarWidth}
          style={{zIndex:1}}
        />
        <Box component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            marginLeft: (theme) => (sideBarIsCollapsed ? 10 : 30), // Adjusting margin based on collapsed state
            transition: 'margin-left 0.3s ease', // Smooth transition for margin,
          }}
          style={{zIndex:10}}
        >
          <Outlet />
        </Box>
      </Box>
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
            element: <Home />,
            errorElement: <div>404 Page Not Found</div>
          },
          {
            path: "/workflow", // Default route
            element: <Flow />,
            errorElement: <div>404 Page Not Found</div>
          },
          {
            path: "/templates",
            element: <TemplatePage />,
          },
          {
            path: "/trace/:id",
            element: <WorkflowTrace />,
          },
          {
            path: "/run/:id",
            element: <RunTemplate />,
            errorElement: <div>404 Page Not Found</div>
          },
          {
            path: "/chat/:id",
            element: <ChatComponent />,
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