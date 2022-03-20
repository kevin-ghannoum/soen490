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
                    const data = await getBusinessTransactionExpenses(id);
                    const expenses: AllBusinessExpensesDTO[] = [];
                    data.data.forEach((element: AllBusinessExpensesDTO) => {
                        expenses.unshift({
                            id: element.id,
                            wages: element.wages,
                            tools: element.tools,
                            others: element.others,
                            name: element.name,
                        });
                    });
                    setExpensesList(expenses);
                } catch (e) { }
            }
        };
        const loadProductions = async () => {
            if (id) {
                try {
                    const data = await getBusinessTransactionProductions(id);
                    const productions: AllBusinessProductionsDTO[] = [];
                    data.data.forEach((element: AllBusinessProductionsDTO) => {
                        productions.unshift({
                            id: element.id,
                            value: element.value,
                            name: element.name,
                        });
                    });
                    setProductionsList(productions);
                } catch (e) { }
            }
        };
        const loadPieChartData = async () => {
            const data = [
                { title: 'Wages', value: 1000, color: '#017EFA' },
                { title: 'Tools', value: 750, color: '#51CBFF' },
                { title: 'Other', value: 250, color: '#86E0FF' },
            ];

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
                    const info: ProjectDisplay[] = data.data[0];
                    setProjectInfo(info);
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
            for (let i = 0; i < productionsList.length; i++) {
                profits.unshift({
                    id: productionsList[i].id,
                    value: "" + (parseFloat(productionsList[i].value) - parseFloat(expensesList[i].wages) - parseFloat(expensesList[i].tools) - parseFloat(expensesList[i].others)),
                    name: productionsList[i].name,
                });
            }
            setProfitList(profits);
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
                                            <TableRow key={production.id}>
                                                <TableCell component="th" scope="row">
                                                    {production.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(production.value)}</TableCell>
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
                                            <TableRow key={expense.id}>
                                                <TableCell component="th" scope="row">
                                                    {expense.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.wages)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
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
                                            <TableRow key={expense.id}>
                                                <TableCell component="th" scope="row">
                                                    {expense.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.tools)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
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
                                            <TableRow key={expense.id}>
                                                <TableCell component="th" scope="row">
                                                    {expense.name}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.others)}</TableCell>
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
                            animate
                            data={pieChartData}
                            radius={PieChart.defaultProps.radius - 7}
                            //label={({ dataEntry }) => dataEntry.title + ": " + dataEntry.value + '$ (' + Math.round(dataEntry.percentage) + '%)'}
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
