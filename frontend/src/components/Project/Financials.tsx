import {
  Box,
  Collapse,
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
import financialsStyle from './FinancialsStyle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getAllBusinessProject } from '../../services/ProjectAPI';
import { getBusinessTransactionExpenses, getBusinessTransactionProductions } from '../../services/TransactionAPI';
import { ProjectDisplay } from '../../dto/ProjectDTOs';
import { AllBusinessExpensesDTO, AllBusinessProductionsDTO } from '../../dto/TransactionDTOs';
import { useHistory } from 'react-router';
import { PieChart } from 'react-minimal-pie-chart';
import { selectAccount } from '../../features/account/AccountSlice';
import { useAppSelector } from '../../redux/hooks';

interface Profit {
  id: string;
  name: string;
  value: string;
}

interface PieChartData {
  title: string;
  value: number;
  color: string;
}

const Financials: React.FC = () => {
  const classes = financialsStyle();
  const history = useHistory();
  const [projectsInfo, setProjectsInfo] = useState<ProjectDisplay[]>([]);
  const [expensesList, setExpensesList] = useState<AllBusinessExpensesDTO[]>([]);
  const [productionsList, setProductionsList] = useState<AllBusinessProductionsDTO[]>([]);
  const [profitsList, setProfitsList] = useState<Profit[]>([]);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);

  const [saleValueTotal, setSaleValueTotal] = useState<number>(0);
  const [productionTotal, setProductionTotal] = useState<number>(0);
  const [wagesTotal, setWagesTotal] = useState<number>(0);
  const [toolsTotal, setToolsTotal] = useState<number>(0);
  const [otherTotal, setOthersTotal] = useState<number>(0);
  const [profitTotal, setProfitTotal] = useState<number>(0);

  const account = useAppSelector(selectAccount);

  const useRowStyles = makeStyles({
    root: {
      '& > *': {
        borderBottom: 'unset',
      },
    },
  });

  useEffect(() => {
    const loadExpenses = async () => {
      try {
        let data;
        if (account.businessAcc) {
          data = await getBusinessTransactionExpenses(account.businessAcc?.businessId);
        } else {
          data = await getBusinessTransactionExpenses(1);
        }
        const expenses: AllBusinessExpensesDTO[] = [];
        var totalWagesValue = 0;
        var totalToolsValue = 0;
        var totalOthersValue = 0;
        data.data.forEach((element: AllBusinessExpensesDTO) => {
          expenses.push({
            projectId: element.projectId,
            wagesValue: element.wagesValue,
            toolsValue: element.toolsValue,
            othersValue: element.othersValue,
            name: element.name,
          });
          totalWagesValue += parseFloat(element.wagesValue);
          totalToolsValue += parseFloat(element.toolsValue);
          totalOthersValue += parseFloat(element.othersValue);
        });
        setExpensesList(expenses);
        setWagesTotal(totalWagesValue);
        setToolsTotal(totalToolsValue);
        setOthersTotal(totalOthersValue);
      } catch (e) {}
    };
    const loadProductions = async () => {
      try {
        let data;
        if (account.businessAcc) {
          data = await getBusinessTransactionProductions(account.businessAcc?.businessId);
        } else {
          data = await getBusinessTransactionProductions(1);
        }
        const productions: AllBusinessProductionsDTO[] = [];
        var totalValue = 0;
        data.data.forEach((element: AllBusinessProductionsDTO) => {
          productions.push({
            projectId: element.projectId,
            value: element.value,
            name: element.name,
          });
          totalValue += parseFloat(element.value);
        });
        setProductionsList(productions);
        setProductionTotal(totalValue);
      } catch (e) {}
    };
    const loadPieChartData = async () => {
      var data = [];
      if (wagesTotal === 0 && toolsTotal === 0 && otherTotal === 0) {
        data = [
          { title: 'Wages', value: 1, color: '#017EFA' },
          { title: 'Tools', value: 1, color: '#51CBFF' },
          { title: 'Other', value: 1, color: '#86E0FF' },
        ];
      } else {
        data = [
          { title: 'Wages', value: wagesTotal, color: '#017EFA' },
          { title: 'Tools', value: toolsTotal, color: '#51CBFF' },
          { title: 'Other', value: otherTotal, color: '#86E0FF' },
        ];
      }
      setPieChartData(data);
    };

    loadExpenses();
    loadProductions();
    loadPieChartData();
    // eslint-disable-next-line
  }, [wagesTotal, toolsTotal, otherTotal]);

  useEffect(() => {
    const getProjectInfo = async () => {
      try {
        let data;
        if (account.businessAcc) {
          data = await getAllBusinessProject(account.businessAcc?.businessId);
        } else {
          data = await getAllBusinessProject(1);
        }
        const info: ProjectDisplay[] = data.data;
        var totalSaleAmount = 0;
        info.forEach((element: ProjectDisplay) => {
          totalSaleAmount += parseFloat('' + element.sale.amount);
        });
        setProjectsInfo(info);
        setSaleValueTotal(totalSaleAmount);
      } catch (e) {
        history.push('/error');
      }
    };
    getProjectInfo();
    // eslint-disable-next-line
  }, [history]);

  useEffect(() => {
    const loadProfit = async () => {
      const profits: Profit[] = [];
      var totalProfitValue = 0;
      for (let i = 0; i < productionsList.length; i++) {
        profits.push({
          id: productionsList[i].projectId,
          value:
            '' +
            (parseFloat(productionsList[i].value) -
              parseFloat(expensesList[i].wagesValue) -
              parseFloat(expensesList[i].toolsValue) -
              parseFloat(expensesList[i].othersValue)),
          name: productionsList[i].name,
        });
        totalProfitValue +=
          parseFloat(productionsList[i].value) -
          parseFloat(expensesList[i].wagesValue) -
          parseFloat(expensesList[i].toolsValue) -
          parseFloat(expensesList[i].othersValue);
      }
      setProfitsList(profits);
      setProfitTotal(totalProfitValue);
    };
    loadProfit();
  }, [productionsList, expensesList]);

  const numberWithCommas = (price: string) => {
    let dollarUSLocale = Intl.NumberFormat('en-US');
    return dollarUSLocale.format(Number(price));
  };

  const createData = (
    name: string,
    projectInfo: ProjectDisplay[],
    expenseList: AllBusinessExpensesDTO[],
    productionList: AllBusinessProductionsDTO[],
    profitList: Profit[]
  ) => {
    return {
      name,
      projectInfo,
      expenseList,
      productionList,
      profitList,
    };
  };

  const rows = [createData('Data', projectsInfo, expensesList, productionsList, profitsList)];

  const RevenuesRow = (props: { row: ReturnType<typeof createData> }) => {
    const { row } = props;
    const [openFirstTable, setOpenFirstTable] = useState(true);
    const [openSecondTable, setOpenSecondTable] = useState(true);
    const rowClasses = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={rowClasses.root}>
          <TableCell style={{ width: '2%' }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpenFirstTable(!openFirstTable)}>
              {openFirstTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Box component="span" style={{ fontWeight: 'bold' }}>
              {'Sale Values'}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openFirstTable} timeout="auto">
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>
                        Amount ($)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.projectInfo.map((project) =>
                      project.sale.amount !== 0 ? (
                        <TableRow key={project.id}>
                          <TableCell component="th" scope="row">
                            {project.title}
                          </TableCell>
                          <TableCell align="center">{numberWithCommas('' + project.sale.amount)}</TableCell>
                        </TableRow>
                      ) : (
                        ''
                      )
                    )}
                  </TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {numberWithCommas('' + saleValueTotal)}
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className={rowClasses.root}>
          <TableCell style={{ width: '2%' }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpenSecondTable(!openSecondTable)}>
              {openSecondTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Box component="span" style={{ fontWeight: 'bold' }}>
              {'Money Received'}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openSecondTable} timeout="auto">
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>
                        Amount ($)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.productionList.map((production) =>
                      String(production.value) !== '0' ? (
                        <TableRow key={production.projectId}>
                          <TableCell component="th" scope="row">
                            {production.name}
                          </TableCell>
                          <TableCell align="center">{numberWithCommas(production.value)}</TableCell>
                        </TableRow>
                      ) : (
                        ''
                      )
                    )}
                  </TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {numberWithCommas('' + productionTotal)}
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  const ExpensesRow = (props: { row: ReturnType<typeof createData> }) => {
    const { row } = props;
    const [openFirstTable, setOpenFirstTable] = useState(true);
    const [openSecondTable, setOpenSecondTable] = useState(true);
    const [openThirdTable, setOpenThirdTable] = useState(true);
    const rowClasses = useRowStyles();

    return (
      <React.Fragment>
        <TableRow className={rowClasses.root}>
          <TableCell style={{ width: '2%' }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpenFirstTable(!openFirstTable)}>
              {openFirstTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Box component="span" style={{ fontWeight: 'bold' }}>
              {'Labour Fees'}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openFirstTable} timeout="auto">
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>
                        Amount ($)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.expenseList.map((expense) =>
                      String(expense.wagesValue) !== '0' ? (
                        <TableRow key={expense.projectId}>
                          <TableCell component="th" scope="row">
                            {expense.name}
                          </TableCell>
                          <TableCell align="center">{numberWithCommas(expense.wagesValue)}</TableCell>
                        </TableRow>
                      ) : (
                        ''
                      )
                    )}
                  </TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {numberWithCommas('' + wagesTotal)}
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className={rowClasses.root}>
          <TableCell style={{ width: '2%' }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpenSecondTable(!openSecondTable)}>
              {openSecondTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Box component="span" style={{ fontWeight: 'bold' }}>
              {'Tool Fees'}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openSecondTable} timeout="auto">
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>
                        Amount ($)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.expenseList.map((expense) =>
                      String(expense.toolsValue) !== '0' ? (
                        <TableRow key={expense.projectId}>
                          <TableCell component="th" scope="row">
                            {expense.name}
                          </TableCell>
                          <TableCell align="center">{numberWithCommas(expense.toolsValue)}</TableCell>
                        </TableRow>
                      ) : (
                        ''
                      )
                    )}
                  </TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {numberWithCommas('' + toolsTotal)}
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
        <TableRow className={rowClasses.root}>
          <TableCell style={{ width: '2%' }}>
            <IconButton aria-label="expand row" size="small" onClick={() => setOpenThirdTable(!openThirdTable)}>
              {openThirdTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </TableCell>
          <TableCell component="th" scope="row">
            <Box component="span" style={{ fontWeight: 'bold' }}>
              {'Other Fees'}
            </Box>
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={openThirdTable} timeout="auto">
              <Box margin={1}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
                      <TableCell align="center" style={{ fontWeight: 'bold' }}>
                        Amount ($)
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {row.expenseList.map((expense) =>
                      String(expense.othersValue) !== '0' ? (
                        <TableRow key={expense.projectId}>
                          <TableCell component="th" scope="row">
                            {expense.name}
                          </TableCell>
                          <TableCell align="center">{numberWithCommas(expense.othersValue)}</TableCell>
                        </TableRow>
                      ) : (
                        ''
                      )
                    )}
                  </TableBody>
                  <TableRow>
                    <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                      Total
                    </TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      {numberWithCommas('' + otherTotal)}
                    </TableCell>
                  </TableRow>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  const ProfitRow = (props: { row: ReturnType<typeof createData> }) => {
    const { row } = props;

    return (
      <React.Fragment>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Box margin={1}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell style={{ fontWeight: 'bold' }}>Project</TableCell>
                    <TableCell align="center" style={{ fontWeight: 'bold' }}>
                      Amount ($)
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.profitList.map((profit) =>
                    String(profit.value) !== '0' ? (
                      <TableRow key={profit.id}>
                        <TableCell component="th" scope="row">
                          {profit.name}
                        </TableCell>
                        <TableCell align="center">{numberWithCommas(profit.value)}</TableCell>
                      </TableRow>
                    ) : (
                      ''
                    )
                  )}
                </TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" style={{ fontWeight: 'bold' }}>
                    Total
                  </TableCell>
                  <TableCell align="center" style={{ fontWeight: 'bold' }}>
                    {numberWithCommas('' + profitTotal)}
                  </TableCell>
                </TableRow>
              </Table>
            </Box>
          </TableCell>
        </TableRow>
      </React.Fragment>
    );
  };

  return (
    <Grid
      id="View-Financials-Grid"
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
            <Typography variant="h4" style={{ fontWeight: 600, marginBottom: 5 }}>
              Financials
            </Typography>
          </Grid>
          <Grid xs={12}>
            <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20, width: '100%' }}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow style={{ backgroundColor: '#86E0FF' }}>
                    <TableCell colSpan={2}>
                      <Typography align="left" style={{ fontWeight: 'bold', fontSize: 18, paddingLeft: 50 }}>
                        Revenues
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <RevenuesRow key={row.name} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20, width: '100%' }}>
            <Grid xs={12} container direction="row" justifyContent="center">
              <Grid item xs={12}>
                <Box style={{ backgroundColor: '#86E0FF', height: '59.5px', width: '100%' }}>
                  <Typography
                    align="left"
                    style={{ fontWeight: 'bold', paddingTop: 16, fontSize: 18, paddingLeft: 66 }}
                  >
                    Expenses
                  </Typography>
                </Box>
              </Grid>
              <Grid xs={12} xl={8} item>
                <Table aria-label="collapsible table">
                  <TableBody>
                    {rows.map((row) => (
                      <ExpensesRow key={row.name} row={row} />
                    ))}
                  </TableBody>
                </Table>
              </Grid>
              <Grid xs={12} sm={6} xl={4} item>
                <PieChart
                  data={pieChartData}
                  radius={PieChart.defaultProps.radius - 7}
                  label={({ dataEntry }) => dataEntry.title + ' (' + Math.round(dataEntry.percentage) + '%)'}
                  lineWidth={30}
                  labelPosition={50}
                  labelStyle={(index) => ({
                    fill: pieChartData[index].color,
                    fontSize: '5px',
                  })}
                />
              </Grid>
            </Grid>
          </TableContainer>
          <Grid xs={12}>
            <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20, width: '100%' }}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow style={{ backgroundColor: '#86E0FF' }}>
                    <TableCell colSpan={2}>
                      <Typography align="left" style={{ fontWeight: 'bold', fontSize: 18, paddingLeft: 50 }}>
                        Profits
                      </Typography>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <ProfitRow key={row.name} row={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
};

export default Financials;
