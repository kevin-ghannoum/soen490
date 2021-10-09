import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  createEmployeePaper: {
    [theme.breakpoints.down('lg')]: {
      width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    width: '40%',
    margin:"10px"
  },
  createEmployeeFormWrapper: {
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
}));

export default useStyles;
