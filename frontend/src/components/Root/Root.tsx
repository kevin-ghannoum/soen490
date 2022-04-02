import {
  AppBar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { DataGrid, GridColDef } from '@material-ui/data-grid';
import { PieChartOutlined } from '@material-ui/icons';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import ScheduleIcon from '@material-ui/icons/Schedule';
import { useEffect, useState } from 'react';
import { PieChart } from 'react-minimal-pie-chart';
import { withRouter } from 'react-router-dom';
import { AllBusinessExpensesDTO } from '../../dto/TransactionDTOs';
import { selectAccount } from '../../features/account/AccountSlice';
import { useAppSelector } from '../../redux/hooks';
import { getAllNotificationsByCurrentUser } from '../../services/NotificationAPI';
import { getBusinessTransactionExpenses } from '../../services/TransactionAPI';
import MyCalendar from '../Calendar/MyCalendar';
import rootStyles from './RootStyle';

interface DataDisplay {
  id: number;
  date: Date;
  type: string;
  description: string;
}
interface PieChartData {
  title: string;
  value: number;
  color: string;
}

const RootPage = (props: { history: any }) => {
  const [scheduleRows, setScheduleRows] = useState<any>([]);
  const [pieChartData, setPieChartData] = useState<PieChartData[]>([]);
  const className = rootStyles();
  const account = useAppSelector(selectAccount);
  const { history } = props;

  const columns: GridColDef[] = [
    {
      field: 'date',
      headerName: 'Date',
      type: 'date',
      width: 200,
      editable: true,
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150,
      editable: true,
    },
    {
      field: 'description',
      headerName: 'Message',
      width: 400,
      editable: true,
    },
  ];

  useEffect(() => {
    const loadPieChartData = async () => {
      let data;
      if (account.businessAcc) {
        data = await getBusinessTransactionExpenses(account.businessAcc?.businessId);
      } else {
        data = await getBusinessTransactionExpenses(1);
      }
      const expenses: AllBusinessExpensesDTO[] = [];
      var wagesTotal = 0;
      var toolsTotal = 0;
      var otherTotal = 0;
      data.data.forEach((element: AllBusinessExpensesDTO) => {
        expenses.push({
          projectId: element.projectId,
          wagesValue: element.wagesValue,
          toolsValue: element.toolsValue,
          othersValue: element.othersValue,
          name: element.name,
        });
        wagesTotal += parseFloat(element.wagesValue);
        toolsTotal += parseFloat(element.toolsValue);
        otherTotal += parseFloat(element.othersValue);
      });
      var pieData = [];
      if (wagesTotal === 0 && toolsTotal === 0 && otherTotal === 0) {
        pieData = [
          { title: 'Wages', value: 1, color: '#017EFA' },
          { title: 'Tools', value: 1, color: '#51CBFF' },
          { title: 'Other', value: 1, color: '#86E0FF' },
        ];
      } else {
        pieData = [
          { title: 'Wages', value: wagesTotal, color: '#017EFA' },
          { title: 'Tools', value: toolsTotal, color: '#51CBFF' },
          { title: 'Other', value: otherTotal, color: '#86E0FF' },
        ];
      }
      setPieChartData(pieData);
    };

    const fetchSchedule = async () => {
      let rows: DataDisplay[] = [];
      let temp_id = 1;
      const notifications = await getAllNotificationsByCurrentUser();
      notifications.data.forEach((ele: any) => {
        rows.push({
          id: temp_id,
          date: ele.date.split('T')[0],
          type: ele.type,
          description: ele.message,
        });
        temp_id++;
      });
      setScheduleRows(rows);
    };

    loadPieChartData();
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className.root}>
      <Grid
        container
        spacing={0}
        direction="column"
        justifyContent="center"
        alignItems="center"
        style={{ minHeight: '100vh' }}
      >
        <Grid container item xs={12}>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
            <Card elevation={3} className={className.topRow}>
              <CardHeader
                avatar={<PieChartOutlined fontSize="large" color="primary" className={className.ToolBarIcon} />}
                title={<Typography variant="h6">Expenses</Typography>}
              />
              <Divider />
              <CardContent style={{ backgroundColor: '#fff', padding: 24 }}>
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
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={7}>
            <Paper elevation={3} className={className.topRow}>
              <Grid container item direction="column" xs={12} spacing={0} style={{ height: 560, width: '100%' }}>
                <Grid item>
                  <AppBar position="static" color="transparent" elevation={0}>
                    <Toolbar className={className.ToolBar}>
                      <ScheduleIcon fontSize="large" color="primary" className={className.ToolBarIcon} />
                      <Typography className={className.ToolBarTitle} variant="h6">
                        Notifications
                      </Typography>
                    </Toolbar>
                  </AppBar>
                </Grid>
                <Grid item xs>
                  <DataGrid
                    rows={scheduleRows}
                    columns={columns}
                    pageSize={20}
                    // components={{
                    //   NoRowsOverlay: CustomNoRowsOverlay,
                    // }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
        <Grid container item xs={12}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
            <Card elevation={3} className={className.bottomRow}>
              <CardHeader
                avatar={<ScheduleIcon fontSize="large" color="primary" className={className.ToolBarIcon} />}
                title={<Typography variant="h6">Scheduled Content</Typography>}
                action={
                  <Button color="primary" onClick={() => history.push('/calendar')}>
                    See Detail <ArrowForwardIosIcon fontSize="small" />
                  </Button>
                }
              />
              <Divider />
              <CardContent className={className.calendar}>
                <MyCalendar />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={1}></Grid>
      </Grid>
    </div>
  );
};

export default withRouter(RootPage);
