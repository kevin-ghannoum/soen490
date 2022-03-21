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
    TableFooter,
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

interface Props {
    id: string;
}

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

const Financials: React.FC<Props> = ({ id }) => {
    const classes = financialsStyle();
    const history = useHistory();
    const [projectInfo, setProjectInfo] = useState<ProjectDisplay[]>([]);
    const [expensesList, setExpensesList] = useState<AllBusinessExpensesDTO[]>([]);
    const [productionsList, setProductionsList] = useState<AllBusinessProductionsDTO[]>([]);
    const [profitList, setProfitList] = useState<Profit[]>([]);
    const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);

    const [saleValueTotal, setSaleValueTotal] = useState<number>(0);
    const [productionTotal, setProductionTotal] = useState<number>(0);
    const [wagesTotal, setWagesTotal] = useState<number>(0);
    const [toolsTotal, setToolsTotal] = useState<number>(0);
    const [otherTotal, setOthersTotal] = useState<number>(0);
    const [profitTotal, setProfitTotal] = useState<number>(0);

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
                    const data = await getBusinessTransactionExpenses(1);
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
                    console.log(expenses)
                } catch (e) { }
            }
        };
        const loadProductions = async () => {
            if (id) {
                try {
                    const data = await getBusinessTransactionProductions(1);
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
                } catch (e) { }
            }
            console.log(productionsList)
        };
        const loadPieChartData = async () => {
            var data = [];
            if (wagesTotal + toolsTotal + otherTotal == 0) {
                data = [
                    { title: 'Wages', value: 1, color: '#017EFA' },
                    { title: 'Tools', value: 1, color: '#51CBFF' },
                    { title: 'Other', value: 1, color: '#86E0FF' },
                ];
            }
            else {
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
    }, [id]);

    useEffect(() => {
        const getProjectInfo = async () => {
            if (id) {
                try {
                    const data = await getAllBusinessProject(1);
                    const info: ProjectDisplay[] = data.data;
                    var totalSaleAmount = 0;
                    info.forEach((element: ProjectDisplay) => {
                        totalSaleAmount += parseFloat("" + element.sale.amount);
                    });
                    setProjectInfo(info);
                    setSaleValueTotal(totalSaleAmount);
                    console.log(info)
                } catch (e) {
                    history.push('/error');
                }
            }
        };
        getProjectInfo();
    }, [id, history]);

    useEffect(() => {
        const loadProfit = async () => {
            const profits: Profit[] = [];
            var totalProfitValue = 0;
            for (let i = 0; i < productionsList.length; i++) {
                totalProfitValue += parseFloat(productionsList[i].value) - parseFloat(expensesList[i].wagesValue) - parseFloat(expensesList[i].toolsValue) - parseFloat(expensesList[i].othersValue);
                profits.unshift({
                    id: productionsList[i].projectId,
                    value: "" + totalProfitValue,
                    name: productionsList[i].name,
                });
            }
            setProfitList(profits);
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

    const rows = [createData('Data', projectInfo, expensesList, productionsList, profitList)];

    const RevenuesRow = (props: { row: ReturnType<typeof createData> }) => {
        const { row } = props;
        const [openFirstTable, setOpenFirstTable] = useState(true);
        const [openSecondTable, setOpenSecondTable] = useState(true);
        const rowClasses = useRowStyles();

        return (
            <React.Fragment>
                <TableRow className={rowClasses.root}>
                    <TableCell>
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
                                            <TableCell>Project</TableCell>
                                            <TableCell align="center">Amount ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.projectInfo.map((project) => (
                                            <TableRow key={project.id}>
                                                <TableCell component="th" scope="row">
                                                    {project.title}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas("" + project.sale.amount)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell component="th" scope="row"></TableCell>
                                            <TableCell align="center">{numberWithCommas("" + saleValueTotal)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                <TableRow className={rowClasses.root}>
                    <TableCell>
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
                                            <TableCell>Project</TableCell>
                                            <TableCell align="center">Amount ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.productionList.map((production) => (
                                            <TableRow key={production.projectId}>
                                                <TableCell component="th" scope="row">
                                                    {production.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(production.value)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell component="th" scope="row"></TableCell>
                                            <TableCell align="center">{numberWithCommas("" + productionTotal)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
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
                    <TableCell>
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
                                            <TableCell>Project</TableCell>
                                            <TableCell align="center">Amount ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.expenseList.map((expense) => (
                                            <TableRow key={expense.projectId}>
                                                <TableCell component="th" scope="row">
                                                    {expense.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.wagesValue)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell component="th" scope="row"></TableCell>
                                            <TableCell align="center">{numberWithCommas("" + wagesTotal)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                <TableRow className={rowClasses.root}>
                    <TableCell>
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
                                            <TableCell>Project</TableCell>
                                            <TableCell align="center">Amount ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.expenseList.map((expense) => (
                                            <TableRow key={expense.projectId}>
                                                <TableCell component="th" scope="row">
                                                    {expense.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.toolsValue)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell component="th" scope="row"></TableCell>
                                            <TableCell align="center">{numberWithCommas("" + toolsTotal)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </Box>
                        </Collapse>
                    </TableCell>
                </TableRow>
                <TableRow className={rowClasses.root}>
                    <TableCell>
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
                                            <TableCell>Project</TableCell>
                                            <TableCell align="center">Amount ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.expenseList.map((expense) => (
                                            <TableRow key={expense.projectId}>
                                                <TableCell component="th" scope="row">
                                                    {expense.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.othersValue)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell component="th" scope="row"></TableCell>
                                            <TableCell align="center">{numberWithCommas("" + otherTotal)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
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
        const [openTable, setOpenTable] = useState(true);
        const rowClasses = useRowStyles();

        return (
            <React.Fragment>
                <TableRow className={rowClasses.root}>
                    <TableCell>
                        <IconButton aria-label="expand row" size="small" onClick={() => setOpenTable(!openTable)}>
                            {openTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </IconButton>
                    </TableCell>
                    <TableCell component="th" scope="row">
                        <Box component="span" style={{ fontWeight: 'bold' }}>
                            {''}
                        </Box>
                    </TableCell>
                </TableRow>
                <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                        <Collapse in={openTable} timeout="auto">
                            <Box margin={1}>
                                <Table size="small" aria-label="purchases">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Project</TableCell>
                                            <TableCell align="center">Amount ($)</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {row.profitList.map((profit) => (
                                            <TableRow key={profit.id}>
                                                <TableCell component="th" scope="row">
                                                    {profit.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(profit.value)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow >
                                            <TableCell component="th" scope="row"></TableCell>
                                            <TableCell align="center">{numberWithCommas("" + profitTotal)}</TableCell>
                                        </TableRow>
                                    </TableFooter>
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
            id="Single-Project-Transaction"
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
                                    <TableRow>
                                        <TableCell />
                                        <TableCell style={{ fontWeight: 'bold', paddingRight: 200, fontSize: 18 }}>Revenues</TableCell>
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
                    <Grid xs={8}>
                        <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20, width: '100%' }}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell style={{ fontWeight: 'bold', paddingRight: 200, fontSize: 18 }}>Expenses</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((row) => (
                                        <ExpensesRow key={row.name} row={row} />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                    <Grid xs={4}>
                        <PieChart
                            style={{ marginTop: 50 }}
                            animate
                            data={pieChartData}
                            radius={PieChart.defaultProps.radius - 7}
                            label={({ dataEntry }) => dataEntry.title + " (" + Math.round(dataEntry.percentage) + '%)'}
                            lineWidth={30}
                            labelPosition={50}
                            labelStyle={(index) => ({
                                fill: pieChartData[index].color,
                                fontSize: '5px',
                            })}
                        />;
                    </Grid>
                    <Grid xs={12}>
                        <TableContainer component={Paper} style={{ marginTop: 20, marginBottom: 20, width: '100%' }}>
                            <Table aria-label="collapsible table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell />
                                        <TableCell style={{ fontWeight: 'bold', paddingRight: 200, fontSize: 18 }}>Profit</TableCell>
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
            </Paper >
        </Grid >
    );
};

export default Financials;
