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
    Tooltip,
    Typography,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import financialsStyle from './FinancialsStyle';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { getAllBusinessProject } from '../../services/ProjectAPI';
import { getExpensesForProject, getProductionsForProject } from '../../services/TransactionAPI';
import { ProjectDisplay, ProjectEmployeeDisplay } from '../../dto/ProjectDTOs';
import { ExpenseDataRetrievalFormatDTO, ProductionDataRetrievalFormatDTO } from '../../dto/TransactionDTOs';
//import CreateExpense from './CreateExpense';
//import CreateProduction from './CreateProduction';
//import DeleteModalTransaction from './DeleteModalTransaction';
import { useHistory } from 'react-router';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { PieChart } from 'react-minimal-pie-chart';

interface Props {
    id: string;
}

const Financials: React.FC<Props> = ({ id }) => {
    const classes = financialsStyle();
    const history = useHistory();
    const [projectInfo, setProjectInfo] = useState<ProjectDisplay>();
    const [employeesName, setEmployeesName] = useState<ProjectEmployeeDisplay[]>([]);
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


    const useRowStyles = makeStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
    });


    const dataMock = [
        { title: 'Wages', value: 1000, color: '#017EFA' },
        { title: 'Tools', value: 750, color: '#51CBFF' },
        { title: 'Other', value: 250, color: '#86E0FF' },
    ];

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
                } catch (e) { }
            }
        };
        const loadProductions = async () => {
            if (id) {
                try {
                    const data = await getProductionsForProject(id);
                    const productions: ProductionDataRetrievalFormatDTO[] = [];
                    data.data.forEach((element: ProductionDataRetrievalFormatDTO) => {
                        const formattedDate = element.transaction.date.split('T');
                        const formattedPaymentType =
                            element.invoice.paymentType.charAt(0) + element.invoice.paymentType.substring(1).toLowerCase();
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
                                paymentType: formattedPaymentType,
                            },
                        });
                    });
                    setProductionsList(productions);
                } catch (e) { }
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
                    const employee = data.data[1];
                    info.createdDate = trimDate(info.createdDate);
                    info.followUpDate = trimDate(info.followUpDate);
                    info.deadlineDate = trimDate(info.deadlineDate);
                    setProjectInfo(info);
                    setEmployeesName(employee);
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

    const numberWithCommas = (price: string) => {
        let dollarUSLocale = Intl.NumberFormat('en-US');
        return dollarUSLocale.format(Number(price));
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
                                        {row.expenseList.map((expense) => (
                                            <TableRow key={expense.id}>
                                                <TableCell component="th" scope="row">
                                                    {expense.transaction.date}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.transaction.amount)}</TableCell>
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
                                                    {production.transaction.date}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(production.transaction.amount)}</TableCell>
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
                                                    {expense.transaction.date}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.transaction.amount)}</TableCell>
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
                                        {row.productionList.map((production) => (
                                            <TableRow key={production.id}>
                                                <TableCell component="th" scope="row">
                                                    {production.transaction.date}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(production.transaction.amount)}</TableCell>
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
                                        {row.productionList.map((production) => (
                                            <TableRow key={production.id}>
                                                <TableCell component="th" scope="row">
                                                    {production.transaction.date}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(production.transaction.amount)}</TableCell>
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
                                        {row.expenseList.map((expense) => (
                                            <TableRow key={expense.id}>
                                                <TableCell component="th" scope="row">
                                                    {expense.transaction.date}
                                                </TableCell>
                                                <TableCell align="center">{numberWithCommas(expense.transaction.amount)}</TableCell>
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

    const renderEmployeeRow = (props: ListChildComponentProps) => {
        const { index, style } = props;

        return (
            <ListItem button style={style} key={index}>
                <ListItemText primary={employeesName[index].account.username} />
            </ListItem>
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
                            data={dataMock}
                            radius={PieChart.defaultProps.radius - 7}
                            //label={({ dataEntry }) => dataEntry.title + ": " + dataEntry.value + '$ (' + Math.round(dataEntry.percentage) + '%)'}
                            label={({ dataEntry }) => dataEntry.title + " (" + Math.round(dataEntry.percentage) + '%)'}
                            lineWidth={30}
                            labelPosition={50}
                            labelStyle={(index) => ({
                                fill: dataMock[index].color,
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
                    <Grid xs={12} className={classes.profitDisplay}>
                        Gross Profit: ${profit}
                    </Grid>
                </Grid>
            </Paper >
        </Grid >
    );
};

export default Financials;
