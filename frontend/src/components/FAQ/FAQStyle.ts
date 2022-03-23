import { makeStyles } from '@material-ui/core';

const FAQStyle = makeStyles((theme) => ({
  pageTitle: {
    paddingTop: '100px',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  tablePaper: {
    [theme.breakpoints.down('lg')]: {
      width: '60%',
      marginTop: '20px',

    },
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      marginTop: '20px',
    },
    width: '70%',
    margin: 'auto',
    marginTop: '40px',
    borderRadius: '10px',
  },
  questionHeader: {
    fontSize: '18px',
    fontWeight: 600,
    backgroundColor: '#B6E9FF',
  },
  questionStyle: {
    fontSize: '18px',
    fontWeight: 600,
  },
  answerBox: {
    padding: "10px 15px"
  },
}));

export default FAQStyle;
