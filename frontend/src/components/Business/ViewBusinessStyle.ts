import { makeStyles } from '@material-ui/core';

const viewBusinessStyle = makeStyles((theme) => ({
  addBusinessButton: {
    width: '150px',
    marginLeft: 'auto',
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
}));

export default viewBusinessStyle;
