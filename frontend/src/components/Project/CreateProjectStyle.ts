import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  createProjectPaper: {
    [theme.breakpoints.down('lg')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    width: '50%',
    margin: '10px',
  },
  createProjectFormWrapper: {
    [theme.breakpoints.down('lg')]: {
      width: '80%',
    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
    },
    width: '90%',
    margin: 'auto',
  },
  assigneeWrapper: {
    display: 'flex',
  },
  selectBox: {
    width: '75%',
  },
  Typo: {
    padding: 7,
    marginTop: 2,
  },
  upload: {
    float: 'right',
  },
  projectTitle: {
    fontWeight: 600,
    float: 'left',
  },
  descriptionBox: {
    width: '100%',
    marginTop: 15,
  },
  optionalDescriptionBox: {
    width: '100%',
    marginTop: 10,
  },
  descriptionFields: {
    width: '100%',
    marginTop: 5,
  },
  dateFields: {
    width: '100%',
    marginTop: 35,
  },
}));

export default useStyles;
