import { AppBar, Box, Button, IconButton, LinearProgress, makeStyles, Toolbar } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import React from 'react';

const LandingPage = () => {
  const sidebarStyle = makeStyles((theme) => ({
    list: {
      width: 'auto',
      color: '#FFFFFF',
    },
    appbar: {
      background: '#FFFFFF',
    },
    paper: {
      background: '#0B26B7',
    },
    icon: {
      color: '#FFFFFF',
    },
    menuicon: {
      color: '#0B26B7',
    },
    logo: {
      padding: '10px',
    },
    blur: {
      color: 'transparent',
      textShadow: '0 0 5px rgba(0,0,0,0.5)',
    },
  }));

  const classes = sidebarStyle();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <React.Fragment key="left">
        <AppBar position="fixed" className={classes.appbar}>
          <Toolbar>
            <Box>
              <IconButton edge="start" disabled={true}>
                <MenuIcon className={classes.menuicon} />
              </IconButton>
            </Box>
            <Box sx={{ color: 'black' }}></Box>
            <Box sx={{ position: 'absolute', right: 130, color: 'black' }}>
              <span className={classes.blur}>Loading</span>
            </Box>
            <Box sx={{ position: 'absolute', right: 0, paddingRight: '20px' }}>
              <Button size="medium" variant="contained" color="primary" disabled={true}>
                <span className={classes.blur}>Log out</span>
              </Button>
            </Box>
          </Toolbar>
          <LinearProgress />
        </AppBar>
      </React.Fragment>
    </Box>
  );
};

export default LandingPage;
