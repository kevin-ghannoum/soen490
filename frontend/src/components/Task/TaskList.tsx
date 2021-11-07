import { Button, Grid, Link, Paper } from '@material-ui/core';
import { DataGrid, GridColDef, GridSelectionModel } from '@material-ui/data-grid';
import _ from './TaskStyle';
import * as React from 'react';
import { useState, useEffect } from 'react';
import { getAllTask } from '../../services/TaskAPI';
import { TaskStatus } from '../../dto/TaskDTOs';
import { useHistory } from 'react-router';

interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  deadlineDate: string;
  createdDate: string;
  modifiedDate: string;
  projectId: string;
  employees: string[];
}

interface DataDisplay {
  id: number;
  title: any;
  description: string;
  status: string;
  deadlineDate: string;
  projectId: string;
}

const TaskList: React.FC = () => {
  const [taskList, setTaskList] = useState<any>([]);
  const [select, setSelection] = useState<GridSelectionModel>();
  const history = useHistory();
  const handleRowSelection = (id: GridSelectionModel) => {
    setSelection(id);
  };

  const onClickAddTask = () => {
    history.push('/tasks/new');
  };

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      width: 170,
      editable: false,
      renderCell: (params: any) => {
        return <Link href={`/tasks/edit/${params.value.id}?edit=true`}>{params.value.title}</Link>;
      },
    },
    {
      field: 'projectId',
      headerName: 'Project',
      width: 150,
      editable: false,
    },
    {
      field: 'description',
      headerName: 'Task Description',
      width: 300,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: false,
    },
    {
      field: 'deadlineDate',
      headerName: 'Project Deadline',
      width: 190,
      editable: false,
    },
  ];

  const classes = _.listTaskStyles();
  useEffect(() => {
    const fetchData = async () => {
      const tasks = await getAllTask();
      let display: DataDisplay[] = [];
      tasks.data.forEach(async (element: Task) => {
        const deadlineDate = element.deadlineDate.split('T')[0];
        display.push({
          id: element.id,
          title: { id: element.id, title: element.title },
          description: element.description,
          status: element.status,
          deadlineDate: deadlineDate,
          projectId: element.projectId,
        });
      });
      setTaskList(display);
    };
    fetchData();
  }, [select]);
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
      <Paper elevation={3} className={classes.editTaskPaper}>
        <Grid item xs={12} style={{ height: 560, width: '100%' }}>
          {' '}
          <DataGrid rows={taskList} columns={columns} pageSize={8} onSelectionModelChange={handleRowSelection} />
        </Grid>
      </Paper>
      <Grid item xs={12}>
        <Button
          variant="contained"
          // style={{ width: '150px', marginBottom: 50, alignItems: 'right' }}
          color="primary"
          component="span"
          onClick={onClickAddTask}
        >
          Add Task
        </Button>
      </Grid>
    </Grid>
  );
};

export default TaskList;
