import { makeStyles } from '@material-ui/core';

const rootStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  topRow: {
    height: '560px',
    margin: '10px',
    '& .MuiDataGrid-root': {
      border: 0,
    },
    '& .MuiCardHeader-root': {
      textAlign: 'left',
    },
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
  },
  bottomRow: {
    height: '560px',
    margin: '10px',
    '& .MuiCardHeader-root': {
      textAlign: 'left',
    },
    '& .MuiCardHeader-action': {
      marginTop: 0,
    },
  },
  ToolBar: {
    flexGrow: 1,
    textAlign: 'left',
  },
  ToolBarIcon: {
    marginRight: theme.spacing(2),
  },
  ToolBarTitle: {
    flexGrow: 1,
  },
  calendar: {
    backgroundColor: '#fff',
    padding: 24,
    '& .rbc-calendar': {
      height: 441,
    },
  },
}));

export default rootStyles;
