import { makeStyles } from "@material-ui/core";

const listTaskStyles = makeStyles((theme) => ({
    editTaskPaper: {
      [theme.breakpoints.down('lg')]: {
        width: '75%',
      },
      [theme.breakpoints.down('sm')]: {
        width: '90%',
      },
      width: '70%',
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
    calendar:{
      backgroundColor: '#fff',
      padding: 24 ,
      '& .rbc-calendar': {
        height: 600,
      },
    }
}));

export default listTaskStyles;