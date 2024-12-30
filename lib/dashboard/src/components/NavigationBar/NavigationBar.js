import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Divider, Box } from '@mui/material';
import { CiTextAlignJustify, CiLogout } from 'react-icons/ci';
import { IoIosGitBranch } from 'react-icons/io';
import { IoDocumentTextOutline } from 'react-icons/io5';
import { TbLambda } from 'react-icons/tb';
import { useTheme } from '@mui/material/styles';
import { MdKeyboardArrowLeft } from "react-icons/md";


import { useAuth } from '../../contexts/AuthContext';



const NavigationBar = ({isCollapsed, setIsCollapsed, sideBarWidth}) => {
  const { logout } = useAuth();

  const theme = useTheme();  // Get theme object to use for mixins

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Opened and Closed mixins for smooth transitions
  const openedMixin = (theme) => ({
    width: sideBarWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  });

  const closedMixin = (theme) => ({
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
      width: `calc(${theme.spacing(8)} + 1px)`,
    },
  });

  return (
    <>
      {/* Drawer for the sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            backgroundColor: '#f7f7f7',
            boxSizing: 'border-box',
            ...(!isCollapsed ? openedMixin(theme) : closedMixin(theme)),
          },
        }}
        open
      >
        {/* Button to toggle the sidebar */}
        <Box sx={{ padding: '16px', display: 'flex', justifyContent: 'right' }}>
          <IconButton onClick={toggleSidebar} sx={{ fontSize: '24px' }}>
            {isCollapsed ? <CiTextAlignJustify/> : <MdKeyboardArrowLeft />}
          </IconButton>
        </Box>

        {/* Navigation items */}
        <List>
          <ListItem button component={Link} to="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <IoIosGitBranch style={{ fontSize: '24px' }} />
            </ListItemIcon>
            <ListItemText primary={!isCollapsed && 'Create Workflow'} />
          </ListItem>

          <ListItem button component={Link} to="/templates" sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <IoDocumentTextOutline style={{ fontSize: '24px' }} />
            </ListItemIcon>
            <ListItemText primary={!isCollapsed && 'Templates'} />
          </ListItem>

          <ListItem button component={Link} to="/lambdas" sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <TbLambda style={{ fontSize: '24px' }} />
            </ListItemIcon>
            <ListItemText primary={!isCollapsed && 'Lambdas'} />
          </ListItem>

          <Divider sx={{backgroundColor: '#a9a9a9 '}}/>

          {/* Logout button */}
          <ListItem button onClick={logout} sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon sx={{ minWidth: 30 }}>
              <CiLogout style={{ fontSize: '24px' }} />
            </ListItemIcon>
            <ListItemText primary={!isCollapsed && 'Logout'} />
          </ListItem>
        </List>
      </Drawer>

    </>
  );
};

export default NavigationBar;
