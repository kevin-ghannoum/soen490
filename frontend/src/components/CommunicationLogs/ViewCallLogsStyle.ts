import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  addLogButton: {
    width: '150px',
    marginBottom: 10,
    marginRight: 5,
    alignItems: 'right',
  },
  dialogTitle: {
    [theme.breakpoints.down('sm')]: {
      paddingTop: '100px',
    },
    textAlign: 'center',
    padding: '15px',
    fontSize: '24px',
  },
  dialogContentMenus: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignContent: 'center',
  },
  selectBox: {
    width: '75%',
    marginTop: 6,
    alignItems: 'center',
  },
  dialogNote: {
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
    minWidth: '300px',
  },
  dialogActionsButton: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '15px',
    [theme.breakpoints.down('sm')]: {
      paddingBottom: '100px',
    },
  },
}));

export default useStyles;
