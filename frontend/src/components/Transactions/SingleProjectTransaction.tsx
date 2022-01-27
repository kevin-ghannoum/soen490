import {
  Box,
  Button,
  Collapse,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  makeStyles,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import createProjectStyle from './SingleProjectTransactionStyle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getProject } from '../../services/ProjectAPI';
import { getExpensesForProject, getProductionsForProject } from '../../services/TransactionAPI';
import { ProjectDisplay } from '../../dto/ProjectDTOs';
import { ExpenseDataRetrievalFormatDTO, ProductionDataRetrievalFormatDTO } from '../../dto/TransactionDTOs';
import TodayIcon from '@material-ui/icons/Today';
import InfoIcon from '@material-ui/icons/Info';
import CreateExpense from './CreateExpense';
import CreateProduction from './CreateProduction';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DeleteModalTransaction from './DeleteModalTransaction';
import { useHistory } from 'react-router';

interface Props {
  id: string;
}

const SingleProjectTransaction: React.FC<Props> = ({ id }) => {
  const classes = createProjectStyle();
  const history = useHistory();
  const [projectInfo, setProjectInfo] = useState<ProjectDisplay>();
  const [expensesList, setExpensesList] = useState<ExpenseDataRetrievalFormatDTO[]>([]);
  const [productionsList, setProductionsList] = useState<ProductionDataRetrievalFormatDTO[]>([]);
  const [profit, setProfit] = useState<string>();

  const [openExpensesDialog, setOpenExpensesDialog] = useState<boolean>(false);
  const [openProductionsDialog, setOpenProductionsDialog] = useState<boolean>(false);
  const [openDeleteExpenseDialog, setOpenDeleteExpenseDialog] = useState<boolean>(false);
  const [openDeleteProductionDialog, setOpenDeleteProductionDialog] = useState<boolean>(false);
  const [openEditExpenseDialog, setOpenEditExpenseDialog] = useState<boolean>(false);
  const [openEditProductionDialog, setOpenEditProductionDialog] = useState<boolean>(false);

  const [idToDelete, setIdToDelete] = useState<string>('');
  const [idToEdit, setIdToEdit] = useState<string>('');

  const handleClickOpenExpensesDialog = () => {
    setOpenExpensesDialog(true);
  };

  const handleCloseExpensesDialog = () => {
    setOpenExpensesDialog(false);
  };

  const handleClickOpenProductionsDialog = () => {
    setOpenProductionsDialog(true);
  };

  const handleCloseProductionsDialog = () => {
    setOpenProductionsDialog(false);
  };

  const handleCloseExpenseDeleteDialog = () => {
    setOpenDeleteExpenseDialog(false);
    setIdToDelete('');
  };

  const handleOpenExpenseDeleteDialog = (id: string) => {
    setOpenDeleteExpenseDialog(true);
    setIdToDelete(id);
  };

  const handleCloseProductionDeleteDialog = () => {
    setOpenDeleteProductionDialog(false);
    setIdToDelete('');
  };

  const handleOpenProductionDeleteDialog = (id: string) => {
    setOpenDeleteProductionDialog(true);
    setIdToDelete(id);
  };

  const handleCloseExpenseEditDialog = () => {
    setOpenEditExpenseDialog(false);
    setIdToEdit('');
  };

  const handleOpenExpenseEditDialog = (id: string) => {
    setOpenEditExpenseDialog(true);
    setIdToEdit(id);
  };

  const handleCloseProductionEditDialog = () => {
    setOpenEditProductionDialog(false);
    setIdToEdit('');
  };

  const handleOpenProductionEditDialog = (id: string) => {
    setOpenEditProductionDialog(true);
    setIdToEdit(id);
  };

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  useEffect(() => {
    const loadExpenses = async () => {
      if (id) {
        try {
          const data = await getExpensesForProject(id);
          const expenses: ExpenseDataRetrievalFormatDTO[] = [];
          data.data.forEach((element: ExpenseDataRetrievalFormatDTO) => {
            const formattedType = element.type.charAt(0) + element.type.substring(1).toLowerCase();
            const formattedDate = element.transaction.date.split('T');
            expenses.unshift({
              id: element.id,
              type: formattedType,
              transaction: {
                id: element.id,
                amount: element.transaction.amount,
                date: formattedDate[0],
                description: element.transaction.description,
                projectId: element.transaction.projectId,
              },
            });
          });
          setExpensesList(expenses);
        } catch (e) {}
      }
    };
    const loadProductions = async () => {
      if (id) {
        try {
          const data = await getProductionsForProject(id);
          const productions: ProductionDataRetrievalFormatDTO[] = [];
          data.data.forEach((element: ProductionDataRetrievalFormatDTO) => {
            const formattedDate = element.transaction.date.split('T');
            productions.unshift({
              id: element.id,
              transaction: {
                id: element.id,
                amount: element.transaction.amount,
                date: formattedDate[0],
                description: element.transaction.description,
                projectId: element.transaction.projectId,
              },
              invoice: {
                quantity: element.invoice.quantity,
              },
            });
          });
          setProductionsList(productions);
        } catch (e) {}
      }
    };

    loadExpenses();
    loadProductions();
  }, [id]);

  useEffect(() => {
    const getProjectInfo = async () => {
      if (id) {
        try {
          const data = await getProject(id);
          const info: ProjectDisplay = data.data[0];
          info.createdDate = trimDate(info.createdDate);
          info.followUpDate = trimDate(info.followUpDate);
          info.deadlineDate = trimDate(info.deadlineDate);
          setProjectInfo(info);
        } catch (e) {
          history.push('/error');
        }
      }
    };
    getProjectInfo();
  }, [id, history]);

  useEffect(() => {
    const calculateProfit = async () => {
      let expenseValue = 0;
      let productionValue = 0;
      let total = 0;
      expensesList.forEach((expense: ExpenseDataRetrievalFormatDTO) => {
        expenseValue = expenseValue + parseFloat(expense.transaction.amount);
      });
      productionsList.forEach((production: ProductionDataRetrievalFormatDTO) => {
        productionValue = productionValue + parseFloat(production.transaction.amount);
      });
      total = productionValue - expenseValue;
      setProfit(numberWithCommas(total.toString()));
    };
    calculateProfit();
  }, [productionsList, expensesList]);

  const trimDate = (date: string) => {
    const newTrimDate = date.split('T');
    return newTrimDate[0];
  };

  const numberWithCommas = (x: string) => {
    const formattedNumber = parseFloat(x).toFixed(2);
    return formattedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const createData = (
    name: string,
    expenseList: ExpenseDataRetrievalFormatDTO[],
    productionList: ProductionDataRetrievalFormatDTO[]
  ) => {
    return {
      name,
      expenseList,
      productionList,
    };
  };

  const rows = [createData('Data', expensesList, productionsList)];

  const Row = (props: { row: ReturnType<typeof createData> }) => {
    const { row } = props;
    const [openExpenses, setOpenExpenses] = useState(false);
    const [openProductions, setOpenProductions] = useState(false);
    const classes = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpenExpenses(!openExpenses)}>
              {openExpenses ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Box component="span" style={{ fontWeight: 'bold' }}>
              {'View Expenses'}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openExpenses} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="center">Type</TableCell>
                      <TableCell align="center">Amount ($)</TableCell>
                      <TableCell align="center" width={25}>
                        Edit
                      </TableCell>
                      <TableCell align="center" width={25}>
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.expenseList.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell component="th" scope="row">
                          {expense.transaction.date}
                        </TableCell>
                        <TableCell>{expense.transaction.description}</TableCell>
                        <TableCell align="center">{expense.type}</TableCell>
                        <TableCell align="center">{numberWithCommas(expense.transaction.amount)}</TableCell>
                        <TableCell align="center" width={25}>
                          <EditIcon
                            style={{ width: 20, height: 20, marginTop: 5 }}
                            onClick={() => handleOpenExpenseEditDialog(expense.transaction.id)}
                          ></EditIcon>
                        </TableCell>
                        <TableCell align="center" width={25}>
                          <DeleteIcon
                            style={{ width: 20, height: 20, marginTop: 5 }}
                            onClick={() => handleOpenExpenseDeleteDialog(expense.transaction.id)}
                          ></DeleteIcon>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className={classes.root}>
          <TableCell>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpenProductions(!openProductions)}>
              {openProductions ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Box component="span" style={{ fontWeight: 'bold' }}>
              {'View Productions'}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openProductions} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  History
                </Typography>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell align="center">Quantity</TableCell>
                      <TableCell align="center">Amount ($)</TableCell>
                      <TableCell align="center" width={25}>
                        Edit
                      </TableCell>
                      <TableCell align="center" width={25}>
                        Delete
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.productionList.map((production) => (
                      <TableRow key={production.id}>
                        <TableCell component="th" scope="row">
                          {production.transaction.date}
                        </TableCell>
                        <TableCell>{production.transaction.description}</TableCell>
                        <TableCell align="center">{production.invoice.quantity}</TableCell>
                        <TableCell align="center">{numberWithCommas(production.transaction.amount)}</TableCell>
                        <TableCell align="center" width={25}>
                          <EditIcon
                            style={{ width: 20, height: 20, marginTop: 5 }}
                            onClick={() => handleOpenProductionEditDialog(production.transaction.id)}
                          ></EditIcon>
                        </TableCell>
                        <TableCell align="center" width={25}>
                          <DeleteIcon
                            style={{ width: 20, height: 20, marginTop: 5 }}
                            onClick={() => handleOpenProductionDeleteDialog(production.transaction.id)}
                          ></DeleteIcon>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', paddingTop: '75px' }}
    >
      <Paper elevation={3} className={classes.SingleProjectFormWrapper}>
        <Grid item container spacing={3} direction="row" xs={12} className={classes.SingleProjectFormWrapper}>
          <Grid item xs={12} style={{ marginTop: 20 }}>
            <Typography variant="h4" style={{ fontWeight: 600, marginBottom: 20 }}>
              Project Details
            </Typography>
          </Grid>
          <Grid xs={12} style={{ display: 'flex' }}>
            <Grid xs={6}>
              <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h5" className={classes.infoTag}>
                  Information
                </Typography>
                <InfoIcon style={{ marginTop: 5, marginLeft: 5 }}></InfoIcon>
              </Box>
              <Typography variant="subtitle1">
                <Box component="span" className={classes.infoTag}>
                  Title:{' '}
                </Box>
                {projectInfo?.title}
              </Typography>
              <Typography variant="subtitle1">
                <Box component="span" className={classes.infoTag}>
                  Description:{' '}
                </Box>
                {projectInfo?.description}
              </Typography>
              <Typography variant="subtitle1">
                <Box component="span" className={classes.infoTag}>
                  Sale Value:{' '}
                </Box>
                ${projectInfo?.sale.amount}
              </Typography>
            </Grid>
            <Grid xs={6}>
              <Box style={{ display: 'flex', justifyContent: 'center' }}>
                <Typography variant="h5" className={classes.infoTag}>
                  Important dates
                </Typography>
                <TodayIcon style={{ marginTop: 5, marginLeft: 5 }}></TodayIcon>
              </Box>
              <Typography variant="subtitle1">
                <Box component="span" className={classes.infoTag}>
                  Created Date:{' '}
                </Box>
                {projectInfo?.createdDate}
              </Typography>
              <Typography variant="subtitle1">
                <Box component="span" className={classes.infoTag}>
                  Follow up date:{' '}
                </Box>
                {projectInfo?.followUpDate}
              </Typography>
              <Typography variant="subtitle1">
                <Box component="span" className={classes.infoTag}>
                  Deadline Date:{' '}
                </Box>
                {projectInfo?.deadlineDate}
              </Typography>
            </Grid>
          </Grid>
          <Grid xs={12}>
            <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20, width: '100%' }}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell style={{ fontWeight: 'bold', paddingRight: 200, fontSize: 18 }}>Transactions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <Row key={row.name} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid xs={12} className={classes.profitDisplay}>
            Net Profit: ${profit}
          </Grid>
          <Grid xs={12}>
            <Dialog open={openDeleteExpenseDialog} onClose={handleCloseExpenseDeleteDialog} style={{ margin: 'auto' }}>
              <DialogContent className={classes.dialogContentMenus}>
                <DeleteModalTransaction
                  id={idToDelete}
                  transactionType="expense"
                  closeModalExpense={handleCloseExpenseDeleteDialog}
                  closeModalProduction={handleCloseProductionDeleteDialog}
                ></DeleteModalTransaction>
              </DialogContent>
            </Dialog>
            <Dialog
              open={openDeleteProductionDialog}
              onClose={handleCloseProductionDeleteDialog}
              style={{ margin: 'auto' }}
            >
              <DialogContent className={classes.dialogContentMenus}>
                <DeleteModalTransaction
                  id={idToDelete}
                  transactionType="production"
                  closeModalExpense={handleCloseExpenseDeleteDialog}
                  closeModalProduction={handleCloseProductionDeleteDialog}
                ></DeleteModalTransaction>
              </DialogContent>
            </Dialog>

            <Dialog open={openEditExpenseDialog} onClose={handleCloseExpenseEditDialog} style={{ margin: 'auto' }}>
              <DialogContent className={classes.dialogContentMenus}>
                <CreateExpense id={id} operation="edit" expenseEditId={idToEdit}></CreateExpense>
              </DialogContent>
            </Dialog>

            <Dialog
              open={openEditProductionDialog}
              onClose={handleCloseProductionEditDialog}
              style={{ margin: 'auto' }}
            >
              <DialogContent className={classes.dialogContentMenus}>
                <CreateProduction id={id} operation="edit" productionEditId={idToEdit}></CreateProduction>
              </DialogContent>
            </Dialog>

            <Button
              onClick={handleClickOpenExpensesDialog}
              color="primary"
              variant="contained"
              id="create_expenses"
              style={{ margin: 30 }}
            >
              Add Expenses
            </Button>
            <Dialog open={openExpensesDialog} onClose={handleCloseExpensesDialog} style={{ margin: 'auto' }}>
              <DialogContent className={classes.dialogContentMenus}>
                <CreateExpense id={id} operation="create" expenseEditId={idToEdit}></CreateExpense>{' '}
              </DialogContent>
            </Dialog>
            <Button
              onClick={handleClickOpenProductionsDialog}
              color="primary"
              variant="contained"
              id="create_productions"
              style={{ margin: 30 }}
            >
              Add Productions
            </Button>
            <Dialog open={openProductionsDialog} onClose={handleCloseProductionsDialog} style={{ margin: 'auto' }}>
              <DialogContent className={classes.dialogContentMenus}>
                <CreateProduction id={id} operation="create" productionEditId={idToEdit}></CreateProduction>
              </DialogContent>
            </Dialog>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default SingleProjectTransaction;
