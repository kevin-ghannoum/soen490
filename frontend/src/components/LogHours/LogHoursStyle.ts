import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  logHoursPaper: {
    maxWidth: 700,
    minWidth: 260,
  },
  logHoursFormWrapper: {
    textAlign: 'left',
    width: '80%',
    margin: '5% auto',
  },
  title: {
    textAlign: 'center',
  },
  formControl: {
    minWidth: '100%',
  },
  switchContainer: {
    height: 72,
  },
  switch: {
    margin: '0',
  },
  successMessage: {
    marginRight: 15,
  }
}));

export default useStyles;
