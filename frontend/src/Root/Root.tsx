import {
  AppBar,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@material-ui/core';
import { Theme } from '@material-ui/core/styles';
import ScheduleIcon from '@material-ui/icons/Schedule';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { DataGrid, GridColDef, GridOverlay, GridSortModel, GridValueGetterParams } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import { selectAccount } from '../../features/account/AccountSlice';
import { useAppSelector } from '../../redux/hooks';
import { getCalls } from '../../services/CallAPI';
import { getEvents } from '../../services/EventAPI';
import { getAllNotificationsByCurrentUser } from '../../services/NotificationAPI';
import listTaskStyles from './RootStyle';
import { PieChart, PieChartOutlined } from '@material-ui/icons';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DataDisplay {
  id: number;
  date: Date;
  type: string;
  description: string;
}
// Temporary for display
const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dailyLabels = ['Temp', 'Temp 2', 'Temp 3'];

const RootPage = () => {
  const [scheduleRows, setScheduleRows] = useState<any>([]);
  const [labelType, setLabelType] = useState('monthly');
  // const [chartData, setChartData] = useState<any>({});
  const [chartLabels, setChartLabels] = useState<string[]>(monthLabels);

  const className = listTaskStyles();
  const account = useAppSelector(selectAccount);

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
      headerName: 'Description',
      width: 400,
      editable: true,
    },
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      let rows: DataDisplay[] = [];
      let temp_id = 1;
      const calls = await getCalls(account.account.email);
      const events = await getEvents();
      const notifications = await getAllNotificationsByCurrentUser();
      calls.data.forEach((ele: any) => {
        rows.push({
          id: temp_id,
          date: ele.date,
          type: 'Call',
          description: '',
        });
        temp_id++;
      });
      events.data.forEach((ele: any) => {
        rows.push({
          id: temp_id,
          date: ele.start,
          type: ele.title,
          description: ele.description,
        });
        temp_id++;
      });
      notifications.data.forEach((ele: any) => {
        rows.push({
          id: temp_id,
          date: ele.date,
          type: ele.type,
          description: '',
        });
        temp_id++;
      });
      setScheduleRows(rows);
    };
    fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect(() => {
  //   setChartData({
  //     labels: chartLabels,
  //     datasets: [
  //       {
  //         label: 'Sales',
  //         data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
  //         borderColor: 'rgb(255, 99, 132)',
  //         backgroundColor: 'rgba(255, 99, 132, 0.5)',
  //       },
  //       {
  //         label: 'Production',
  //         data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
  //         borderColor: 'rgb(53, 162, 235)',
  //         backgroundColor: 'rgba(53, 162, 235, 0.5)',
  //       },
  //     ],
  //   });
  // }, [chartLabels]);

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Sales',
        data: [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1100, 1200],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
      {
        label: 'Production',
        data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
        text: 'Sales and Production',
      },
    },
  };

  const handleLabelChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
    switch (newAlignment) {
      case 'daily':
        setChartLabels(dailyLabels);
        break;
      case 'weekly':
        setChartLabels(weekLabels);
        break;
      case 'monthly':
        setChartLabels(monthLabels);
        break;
      default:
        setChartLabels(monthLabels);
        newAlignment = 'monthly';
    }
    setLabelType(newAlignment);
  };

  return (
    <Grid
      container
      id="View-Task-Datagrid"
      spacing={0}
      direction="column"
      justifyContent="center"
      alignContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Card elevation={3} className={className.editTaskPaper}>
        <CardHeader
          avatar={<PieChartOutlined fontSize="large" color="primary" className={className.ToolBarIcon} />}
          title={<Typography variant="h6">Sales & Productions</Typography>}
          action={
            <ToggleButtonGroup color="primary" exclusive value={labelType} onChange={handleLabelChange}>
              <ToggleButton value="daily" color="primary">
                Daily
              </ToggleButton>
              <ToggleButton value="weekly" color="primary">
                Weekly
              </ToggleButton>
              <ToggleButton value="monthly" color="primary">
                Monthly
              </ToggleButton>
            </ToggleButtonGroup>
          }
        />
        <CardContent style={{ backgroundColor: '#fff', padding: 24 }}>
          <Line options={options} data={data} redraw={true} />
        </CardContent>
      </Card>
      <Paper elevation={3} className={className.editTaskPaper}>
        <Grid container item direction="column" xs={12} spacing={0} style={{ height: 560, width: '100%' }}>
          <Grid item>
            <AppBar position="static" color="transparent" elevation={0}>
              <Toolbar className={className.ToolBar}>
                <ScheduleIcon fontSize="large" color="primary" className={className.ToolBarIcon} />
                <Typography className={className.ToolBarTitle} variant="h6">
                  Schedule Content
                </Typography>
                <Button color="primary">
                  See Detail <ArrowForwardIosIcon fontSize="small" />
                </Button>
              </Toolbar>
            </AppBar>
          </Grid>
          <Divider />
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
  );
};

export default RootPage;
