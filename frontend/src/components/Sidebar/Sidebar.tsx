import {
  ListItem,
  ListItemIcon,
  ListItemText,
  List,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Button,
  SwipeableDrawer,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import HomeIcon from '@material-ui/icons/Home';
import AccountTreeIcon from '@material-ui/icons/AccountTree';
import CreateIcon from '@material-ui/icons/Create';
import React from 'react';
import { withRouter } from 'react-router-dom';
import sidebarStyle from './SidebarStyle';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { logout, selectAccount } from '../../features/account/AccountSlice';
import EventIcon from '@material-ui/icons/Event';
type Anchor = 'left';

const Sidebar = (props: { history: any }) => {
  const { history } = props;

  const [state, setState] = React.useState({
    left: false,
  });

  const dispatch = useAppDispatch();

  const account = useAppSelector(selectAccount);

  const toggleDrawer = (anchor: Anchor, open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event &&
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const classes = sidebarStyle();

  const itemsList = [
    {
      role: ['ADMIN', 'BUSINESS', 'SUPERVISOR', 'EMPLOYEE', 'CLIENT'],
      text: 'Homepage',
      icon: <HomeIcon className={classes.icon} />,
      onClick: () => history.push('/'),
    },
    {
      role: ['ADMIN', 'BUSINESS', 'SUPERVISOR', 'EMPLOYEE'],
      text: 'Projects',
      icon: <AccountTreeIcon className={classes.icon} />,
      onClick: () => history.push('/projects'),
    },
    {
      role: ['ADMIN', 'SUPERVISOR', 'BUSINESS'],
      text: 'Booked Projects',
      icon: <AccountTreeIcon className={classes.icon} />,
      onClick: () => history.push('/booked_projects_transactions'),
    },
    {
      role: ['ADMIN', 'SUPERVISOR', 'EMPLOYEE'],
      text: 'Tasks',
      icon: <AccountTreeIcon className={classes.icon} />,
      onClick: () => history.push('/tasks'),
    },
    {
      role: ['ADMIN', 'BUSINESS', 'SUPERVISOR', 'EMPLOYEE'],
      text: 'Logs',
      icon: <AccountTreeIcon className={classes.icon} />,
      onClick: () => history.push('/logs'),
    },
    {
      role: ['ADMIN', 'BUSINESS', 'SUPERVISOR'],
      text: 'Employees',
      icon: <AccountTreeIcon className={classes.icon} />,
      onClick: () => history.push('/employees'),
    },
    {
      role: ['ADMIN'],
      text: 'Businesses',
      icon: <AccountTreeIcon className={classes.icon} />,
      onClick: () => history.push('/business'),
    },
    {
      role: ['ADMIN'],
      text: 'Create Business Account',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/businessAccount/new'),
    },
    {
      role: ['ADMIN', 'BUSINESS'],
      text: 'Create Client Account',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/clientAccount/new'),
    },
    {
      role: ['ADMIN', 'BUSINESS'],
      text: 'Create Employee Account',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/employeeAccount/new'),
    },
    {
      role: ['ADMIN', 'BUSINESS', 'SUPERVISOR'],
      text: 'Log New Pay',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/pay/new'),
    },
    {
      role: ['ADMIN', 'EMPLOYEE', 'SUPERVISOR'],
      text: 'Create New Task',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/tasks/new'),
    },
    {
      role: ['ADMIN', 'BUSINESS', 'SUPERVISOR'],
      text: 'Create Project',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/project'),
    },
    {
      role: ['ADMIN', 'EMPLOYEE'],
      text: 'My Calendar',
      icon: <EventIcon className={classes.icon} />,
      onClick: () => history.push('/calendar'),
    },
  ];

  const handleClick = () => {
    history.push('/');
  };

  const list = (anchor: Anchor) => (
    <Box sx={{ width: 250 }} onClick={toggleDrawer(anchor, false)} onKeyDown={toggleDrawer(anchor, false)}>
      <List className={classes.list}>
        {itemsList.map((item) => {
          const { role, text, icon, onClick } = item;
          return role.includes(account.account.role) ? (
            <ListItem button key={text} onClick={onClick}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText primary={text} />
            </ListItem>
          ) : (
            ''
          );
        })}
      </List>
    </Box>
  );

  const logoutButton = () => {
    dispatch(logout());
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <React.Fragment key="left">
        <AppBar position="fixed" className={classes.appbar}>
          <Toolbar>
            <Box>
              <IconButton onClick={toggleDrawer('left', true)} edge="start">
                <MenuIcon className={classes.menuicon} />
              </IconButton>
            </Box>
            {account.clientAcc?.businessName != null || account.businessAcc?.businessName != null ? (
              <Box sx={{ color: 'black' }}>{account.clientAcc?.businessName || account.businessAcc?.businessName}</Box>
            ) : (
              <Box sx={{ color: 'black' }}></Box>
            )}
            <Box sx={{ position: 'absolute', right: 130, color: 'black' }}>Hello, {account.account.firstName}!</Box>
            <Box sx={{ position: 'absolute', right: 0, paddingRight: '20px' }}>
              <Button size="medium" variant="contained" color="primary" onClick={logoutButton}>
                Log out
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
          anchor="left"
          open={state['left']}
          onClose={toggleDrawer('left', false)}
          onOpen={toggleDrawer('left', true)}
          classes={{ paper: classes.paper }}
        >
          <Button onClick={handleClick}>
            <img
              width="190px"
              height="40px"
              alt="Logo"
              src="https://cdn.discordapp.com/attachments/885685523954401340/899316466883645460/Logo_White.png"
              className={classes.logo}
            />
          </Button>
          {list('left')}
        </SwipeableDrawer>
      </React.Fragment>
    </Box>
  );
};

export default withRouter(Sidebar);
