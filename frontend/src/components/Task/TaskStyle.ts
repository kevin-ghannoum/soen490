import { makeStyles } from '@material-ui/core';

const editTaskStyles = makeStyles((theme) => ({
  editTaskPaper: {
    [theme.breakpoints.down('lg')]: {
      width: '60%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    width: '40%',
    margin: '10px',
    padding: '18px',
  },
  dateContainer: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  dateField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    // width: 200,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    marginRight: 2,
    marginLeft: 1,
  },
  noBorder: {
    border: 'none',
  },
}));

const listTaskStyles = makeStyles((theme) => ({
  editTaskPaper: {
    [theme.breakpoints.down('lg')]: {
      width: '75%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    width: '60%',
    margin: '10px',
  },
}));

const taskStyle = {
  listTaskStyles,
  editTaskStyles,
};

export default taskStyle;
