import {
  Typography,
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from '@material-ui/core';
import { KeyboardArrowDown, KeyboardArrowUp } from '@material-ui/icons';
import FAQStyle from './FAQStyle';
import React from 'react';

const createData = (question: string, answer: string) => {
  return {
    question,
    answer,
  };
};

const Row = (props: { row: ReturnType<typeof createData> }) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  const classes = FAQStyle();

  return (
    <React.Fragment>
      <TableRow className={classes.questionHeader}>
        <TableCell component="th" scope="row" className={classes.questionStyle}>
          {row.question}
        </TableCell>
        <TableCell style={{ width: '10%' }}>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }} className={classes.answerBox}>
              <Typography>{row.answer}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

const rows = [
  createData(
    'Lorem ipsum dolor sit amet?',
    'Phasellus nec semper arcu. Pellentesque et lorem diam. Fusce interdum tempus erat, non dignissim quam. Sed ac nunc condimentum, commodo leo vel, ultrices leo. Aenean venenatis bibendum urna, et mattis nunc. Cras imperdiet leo magna, quis lobortis mi placerat sed. Sed justo augue, lacinia ac ullamcorper ac, egestas sed justo. Cras luctus eros nec congue molestie. Nunc nibh nulla, consequat ac nulla et, faucibus finibus quam. Praesent iaculis malesuada justo in ornare.'
  ),
  createData(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit sed?',
    'Sed consequat ipsum quam, vel cursus ex feugiat vitae. Praesent in nisi id tortor tristique molestie. Integer condimentum tellus non augue eleifend, eu pharetra libero gravida. Etiam et enim facilisis, gravida metus eu, varius ante. Vestibulum id bibendum magna. Maecenas laoreet consequat aliquam. Mauris consequat efficitur fringilla. Pellentesque urna elit, tempor vitae feugiat ac, tincidunt ut nibh. Vestibulum tempor, nisl id sagittis tincidunt, lacus eros dapibus nibh, at lacinia metus magna sit amet ipsum. Sed efficitur enim quis lacus euismod, a hendrerit risus volutpat. In rutrum pharetra massa, ac ullamcorper metus iaculis a. Etiam egestas pretium commodo. Pellentesque ultrices interdum felis, eget placerat nunc malesuada quis. Morbi mattis eu massa a gravida.'
  ),
  createData(
    'Lorem ipsum nunc justo massa, iaculis vitae ultrices ut, malesuada?',
    'Praesent pellentesque lorem eu nisi ornare interdum. Mauris et bibendum tortor, vitae bibendum leo. Donec commodo, metus nec faucibus posuere, ante nulla sodales sapien, id ultrices lorem odio vel felis. Quisque lectus quam, efficitur eget porttitor sit amet, feugiat vitae ex. Praesent vehicula varius molestie. Aliquam id velit ipsum. Duis nec risus venenatis, pretium nisl at, tincidunt risus.'
  ),
  createData(
    'Lorem ipsum sed augue nisi, congue ac nunc?',
    'In hac habitasse platea dictumst. Nullam euismod nunc non euismod scelerisque. Integer pellentesque massa ut libero sagittis, ac molestie mi ornare. Phasellus sollicitudin mauris a ligula finibus ullamcorper. Donec ac leo vehicula, posuere turpis id, viverra est. Duis dictum est eu nulla luctus, in congue risus finibus. Vivamus feugiat sodales quam nec euismod. Cras auctor nulla at volutpat tempus. Ut rhoncus, urna ac gravida pulvinar, erat mi cursus massa, vitae mollis risus lectus eget augue. Phasellus ut purus felis. Suspendisse et mollis libero. Pellentesque dignissim magna sit amet lectus tempor vehicula. Pellentesque nisi quam, rhoncus nec auctor ut, sollicitudin eu mi.'
  ),
  createData(
    'Lorem ipsum duis porta arcu velit, eget molestie leo maximus ut nam?',
    'Donec mattis, lacus eu mollis volutpat, ligula sem consequat est, in luctus nibh purus in libero. Sed orci metus, volutpat ac auctor ac, ultricies laoreet urna. Donec eleifend mi rhoncus diam gravida, in posuere sapien interdum. Aliquam pellentesque, dui eu tempor volutpat, enim sapien tempor arcu, sed faucibus augue mi sit amet purus. Donec ullamcorper non libero id commodo. Maecenas bibendum felis augue, et dignissim arcu rutrum vel. Quisque condimentum orci massa, non varius urna pulvinar nec. Morbi feugiat purus tortor, a pulvinar tellus cursus sit amet. Phasellus fringilla non dolor in gravida. Proin sed dolor risus.'
  ),
];

const FAQ = () => {
  const classes = FAQStyle();
  return (
    <div>
      <Typography className={classes.pageTitle}>Frequently Asked Questions (FAQ)</Typography>
      <TableContainer component={Paper} className={classes.tablePaper}>
        <Table id="faqTable" aria-label="collapsible table">
          <TableBody>
            {rows.map((row) => (
              <Row key={row.question} row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default FAQ;
