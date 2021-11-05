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
import useStyles from './SidebarStyle';

type Anchor = 'left';

const Sidebar = (props: { history: any }) => {
  const { history } = props;

  const [state, setState] = React.useState({
    left: false,
  });

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

  const classes = useStyles();

  const itemsList = [
    {
      text: 'Homepage',
      icon: <HomeIcon className={classes.icon} />,
      onClick: () => history.push('/'),
    },
    {
      text: 'Projects',
      icon: <AccountTreeIcon className={classes.icon} />,
      onClick: () => history.push('/projects'),
    },
    {
      text: 'Create Business Account',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/businessAccount/new'),
    },
    {
      text: 'Create Client Account',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/clientAccount/new'),
    },
    {
      text: 'Create Employee Account',
      icon: <CreateIcon className={classes.icon} />,
      onClick: () => history.push('/employeeAccount/new'),
    },
  ];

  function handleClick() {
    history.push("/");
  }

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List className={classes.list}>
        {itemsList.map((item, index) => {
          const { text, icon, onClick } = item;
          return (
            <ListItem button key={text} onClick={onClick}>
              {icon && <ListItemIcon>{icon}</ListItemIcon>}
              <ListItemText primary={text} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <div>
      {(['left'] as const).map((anchor) => (
        <React.Fragment key={anchor}>
          <AppBar position="fixed" className={classes.appbar}>
            <Toolbar>
              <IconButton onClick={toggleDrawer(anchor, true)} edge="start">
                <MenuIcon className={classes.menuicon} />
              </IconButton>
            </Toolbar>
          </AppBar>
          <SwipeableDrawer
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
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
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
};

export default withRouter(Sidebar);
