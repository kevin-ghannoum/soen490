import { makeStyles } from '@material-ui/core';

const loginStyle = makeStyles((theme) => ({
  loginAppBar: {
    width: '100%',
    margin: 'auto',
    backgroundColor: '#FFFFFF',
  },

  loginAppBarButton: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
      padding: '8px 6px',
    },
    fontSize: '15px',
  },

  loginAppBarContainedButton: {
    [theme.breakpoints.down('sm')]: {
      padding: '6px 16px',
      fontSize: '12px',
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: '10px',
    },
    fontSze: '15px',
  },

  loginPaper: {
    [theme.breakpoints.down('lg')]: {
      width: '30%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    width: '40%',
    margin: '10px',
  },

  blueBox: {
    height: '20px',
    background: '#2BB1E4',
  },

  loginFormWrapper: {
    [theme.breakpoints.down('lg')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    width: '65%',
    padding: '10px',
    margin: 'auto',
  },

  loginButton: {
    minWidth: '100%',
  },
}));

export default loginStyle;
