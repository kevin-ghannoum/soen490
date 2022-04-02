import { makeStyles } from '@material-ui/core';
import { mainTheme } from '../../../configs/MuiConfig';

const logHoursStyle = makeStyles((_theme) => ({
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
  automaticContainer: {
    margin: '0',
  },
  successMessage: {
    marginRight: 15,
  },
  switch_base: {
    '&.Mui-checked': {
      color: mainTheme.palette.primary.main,
    },
    '&.Mui-checked + .MuiSwitch-track': {
      backgroundColor: mainTheme.palette.primary.main,
      opacity: 0.4,
    },
  },
  radio: {
    '&.Mui-checked': {
      color: mainTheme.palette.primary.main,
    },
  },
  updateButton: {
    backgroundColor: '#e8e8e8',
    height: 25,
    '&:hover': {
      backgroundColor: '#cccccc',
    },
  },
}));

export default logHoursStyle;
