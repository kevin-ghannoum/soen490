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
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab';
import { Calendar, momentLocalizer, SlotInfo, View } from 'react-big-calendar';
import MyCalendar, {Event} from '../Calendar/MyCalendar';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';


interface DataDisplay {
  id: number;
  date: Date;
  type: string;
  description: string;
}
interface EventDTO {
  id: number;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  createdBy: string;
  accounts: Array<{ firstName: string; lastName: string; Invited: { email: string; status: string; id: number } }>;
}
const weekLabels = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const dailyLabels = ['Temp', 'Temp 2', 'Temp 3'];

const RootPage = () => {
  const [scheduleRows, setScheduleRows] = useState<any>([]);
  const [labelType, setLabelType] = useState('monthly');
  // const [chartData, setChartData] = useState<any>({});

  const [events, setEvents] = useState<Array<Event>>([]);

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
    // const fetchSchedule = async () => {
    //   let rows: DataDisplay[] = [];
    //   let temp_id = 1;
    //   const calls = await getCalls(account.account.email);
    //   const events = await getEvents();
    //   const notifications = await getAllNotificationsByCurrentUser();
    //   calls.data.forEach((ele: any) => {
    //     rows.push({
    //       id: temp_id,
    //       date: ele.date,
    //       type: 'Call',
    //       description: '',
    //     });
    //     temp_id++;
    //   });
    //   events.data.forEach((ele: any) => {
    //     rows.push({
    //       id: temp_id,
    //       date: ele.start,
    //       type: ele.title,
    //       description: ele.description,
    //     });
    //     temp_id++;
    //   });
    //   notifications.data.forEach((ele: any) => {
    //     rows.push({
    //       id: temp_id,
    //       date: ele.date,
    //       type: ele.type,
    //       description: '',
    //     });
    //     temp_id++;
    //   });
    //   setScheduleRows(rows);
    // };
    
    // fetchSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getEventsData = async () => {
    try {
      const data = (await (await getEvents()).data) as unknown as Array<any>;
      const temp: Array<Event> = [];
      data.forEach((event: EventDTO) => {
        event.start = event.start.slice(0, -1);
        event.end = event.end.slice(0, -1);
        temp.push({
          id: event.id,
          title: event.title,
          start: new Date(event.start),
          end: new Date(event.end),
          location: event.location,
          description: event.description,
          createdBy: event.createdBy,
          accounts: event.accounts,
        });
      });
  setEvents(temp);
    } catch (err) {}
    };


  const data = [
    {
      name: 'Page A',
      uv: 4000,
      pv: 2400,
      amt: 2400,
    },
    {
      name: 'Page B',
      uv: 3000,
      pv: 1398,
      amt: 2210,
    },
    {
      name: 'Page C',
      uv: 2000,
      pv: 9800,
      amt: 2290,
    },
    {
      name: 'Page D',
      uv: 2780,
      pv: 3908,
      amt: 2000,
    },
    {
      name: 'Page E',
      uv: 1890,
      pv: 4800,
      amt: 2181,
    },
    {
      name: 'Page F',
      uv: 2390,
      pv: 3800,
      amt: 2500,
    },
    {
      name: 'Page G',
      uv: 3490,
      pv: 4300,
      amt: 2100,
    },
  ];


  // const handleLabelChange = (event: React.MouseEvent<HTMLElement>, newAlignment: string) => {
  //   switch (newAlignment) {
  //     case 'daily':
  //       setChartLabels(dailyLabels);
  //       break;
  //     case 'weekly':
  //       setChartLabels(weekLabels);
  //       break;
  //     case 'monthly':
  //       setChartLabels(monthLabels);
  //       break;
  //     default:
  //       setChartLabels(monthLabels);
  //       newAlignment = 'monthly';
  //   }
  //   setLabelType(newAlignment);
  // };

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
          // For future implementation
          // action={
          //   <ToggleButtonGroup color="primary" exclusive value={labelType} onChange={handleLabelChange}>
          //     <ToggleButton value="daily" color="primary">
          //       Daily
          //     </ToggleButton>
          //     <ToggleButton value="weekly" color="primary">
          //       Weekly
          //     </ToggleButton>
          //     <ToggleButton value="monthly" color="primary">
          //       Monthly
          //     </ToggleButton>
          //   </ToggleButtonGroup>
          // }
        />
        <CardContent style={{ backgroundColor: '#fff', padding: 24 }}>
          <Grid container direction="row">
            <Grid item xs={7}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={data}>
                  <Line type="monotone" dataKey="uv" stroke="#8884d8" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                </LineChart>
              </ResponsiveContainer>
            </Grid>
            <Grid item xs={3}>{' '}</Grid>
            <Grid item xs={2}>{' '}</Grid>
          </Grid>
          
        </CardContent>
      </Card>
      <Card elevation={3} className={className.editTaskPaper}>
        <CardHeader
          avatar={<ScheduleIcon fontSize="large" color="primary" className={className.ToolBarIcon} />}
          title={<Typography variant="h6">Scheduled Content</Typography>}
          action={
            <Button color="primary">
              See Detail <ArrowForwardIosIcon fontSize="small" />
            </Button>
          }
        />
        <CardContent className={className.calendar}>
         <MyCalendar />
        </CardContent>
      </Card>
      {/* <Paper elevation={3} className={className.editTaskPaper}>
        <Grid container item direction="column" xs={12} spacing={0} style={{ height: 560, width: '100%' }}>
          <Grid item>
            <AppBar position="static" color="transparent" elevation={0}>
              <Toolbar className={className.ToolBar}>
                <ScheduleIcon fontSize="large" color="primary" className={className.ToolBarIcon} />
                <Typography className={className.ToolBarTitle} variant="h6">
                  Scheduled Content
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
      </Paper> */}
    </Grid>
  );
};

export default RootPage;
