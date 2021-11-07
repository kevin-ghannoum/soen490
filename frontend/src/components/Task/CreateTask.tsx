import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  DialogTitle,
  Divider,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { FormikProps, useFormik } from 'formik';
import _ from './TaskStyle';
import { TaskStatus } from '../../dto/TaskDTOs';
import { createTask, deleteTaskById, getTaskById, updateTaskById } from '../../services/TaskAPI';
import { getAllBusinessProject } from '../../services/ProjectAPI';
import createTaskFromSchema from './CreateTaskFormValidation';
import { getAllEmployeeAccounts } from '../../services/AccountAPI';
import {
  createAssignment,
  deleteAssignedByTaskId,
  getAssignedByTaskId,
  updateAssignedByTaskId,
} from '../../services/AssignedAPI';
import { useHistory } from 'react-router';

interface Task {
  createdDate: string;
  deadlineDate: string;
  description: string;
  id: number;
  modifiedDate: string;
  projectId: number;
  status: string;
  title: string;
}

const ManageTask: React.FC<any> = ({ id, edit }) => {
  const [created, setCreated] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<any>([]);
  const [employeeList, setEmployeeList] = useState<string[]>([]);
  const [editState] = useState<boolean>(edit);
  const [open, setOpen] = React.useState(false);

  const history = useHistory();

  const onClickDelete = () => {
    setOpen(true);
  };
  const handleClickConfirm = async () => {
    setOpen(false);
    const assignResponse: AxiosResponse<any> = await deleteAssignedByTaskId(id);
    const taskResponse: AxiosResponse<any> = await deleteTaskById(id);
    if (assignResponse.status === 200 && taskResponse.status === 200) {
      history.push('/tasks');
    }
  };

  const handleClose = () => {
    setOpen(false);
  };
  const onClickCancel = () => {
    history.push('/tasks');
  };

  const formik: FormikProps<any> = useFormik<any>({
    initialValues: {
      title: '',
      description: '',
      status: TaskStatus.NEW,
      deadlineDate: null,
      projectId: '',
      employees: [],
    },
    validationSchema: createTaskFromSchema,
    onSubmit: async (values) => {
      if (editState && id) {
        const taskResponse: AxiosResponse<any> = await updateTaskById(id, {
          title: values.title,
          description: values.description,
          status: values.status,
          deadlineDate: values.deadlineDate,
          modifiedDate: new Date().toLocaleDateString(),
          projectId: values.projectId,
        });
        const assignResponse: AxiosResponse<any> = await updateAssignedByTaskId({
          taskId: id,
          emails: values.employees,
        });
        if (assignResponse.status === 201 && taskResponse.status === 201) {
          setCreated(true);
          history.push('/tasks');
        }
      } else {
        let taskResponse: AxiosResponse<any> = await createTask({
          title: values.title,
          description: values.description,
          status: values.status,
          deadlineDate: values.deadlineDate,
          createdDate: new Date().toLocaleDateString(),
          modifiedDate: new Date().toLocaleDateString(),
          projectId: values.projectId,
        });
        if (taskResponse.status === 201) {
          const taskId: number = taskResponse.data.id;
          const assignResponse: AxiosResponse<any> = await createAssignment({
            taskId: taskId,
            emails: values.employees,
          });
          if (assignResponse.status === 201) {
            setCreated(true);
            history.push('/tasks');
          }
        }
      }
    },
  });

  useEffect(() => {
    if (editState && id) {
      const getEditTask = async () => {
        try {
          const taskToEdit = await getTaskById(id);
          const employees = await getAssignedByTaskId(id);
          const taskData: Task = taskToEdit.data;
          let tempEmployees: string[] = [];

          employees.data.forEach((element: any) => {
            tempEmployees.push(element.email);
          });
          let deadDate = new Date(Date.parse(taskData.deadlineDate));
          formik.setFieldValue('title', taskData.title);
          formik.setFieldValue('status', taskData.status);
          formik.setFieldValue('description', taskData.description);
          formik.setFieldValue('deadlineDate', deadDate.toISOString().split('T')[0]);
          formik.setFieldValue('projectId', taskData.projectId);
          formik.setFieldValue('employees', tempEmployees);
        } catch (error) {
          history.push('/error');
        }
      };
      getEditTask();
    }
    const getProjects = async () => {
      const projects = await getAllBusinessProject(1);
      const tempProjects: Object[] = [];
      projects.data.forEach((element: any) => {
        tempProjects.push({
          id: element.id,
          title: element.title,
        });
      });
      setProjectList(tempProjects);
    };
    const getEmployees = async () => {
      const projects = await getAllEmployeeAccounts();
      const tempEmployees: string[] = [];
      projects.data.forEach((element: any) => {
        tempEmployees.push(element.email);
      });
      setEmployeeList(tempEmployees);
    };
    getEmployees();
    getProjects();
    // eslint-disable-next-line
  }, []);

  const classes = _.editTaskStyles();
  return (
    <div>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh' }}
      >
        <Paper elevation={3} className={classes.editTaskPaper}>
          <form onSubmit={formik.handleSubmit}>
            <Grid item container spacing={1} direction="row" justifyContent="space-between" alignItems="center">
              <Grid item container spacing={3} direction="column" justifyContent="space-evenly" xs={7}>
                <Grid item xs>
                  <Typography variant="h5">Task Specification</Typography>
                </Grid>
                <Grid item xs>
                  <Paper elevation={1}>
                    <TextField
                      variant="outlined"
                      label="Title"
                      name="title"
                      fullWidth
                      onChange={formik.handleChange}
                      value={formik.values.title}
                      error={formik.touched.title && Boolean(formik.errors.title)}
                      helperText={formik.touched.title && formik.errors.title}
                      InputProps={{
                        classes: { notchedOutline: classes.noBorder },
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <Paper elevation={1}>
                    <TextField
                      variant="outlined"
                      label="Description"
                      name="description"
                      value={formik.values.description}
                      onChange={formik.handleChange}
                      multiline
                      rows={10}
                      fullWidth
                      InputProps={{
                        classes: { notchedOutline: classes.noBorder },
                      }}
                    />
                  </Paper>
                </Grid>
                <Grid item xs>
                  <TextField
                    variant="standard"
                    label="Project Deadline"
                    name="deadlineDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.deadlineDate}
                    onChange={formik.handleChange}
                    error={formik.touched.deadlineDate && Boolean(formik.errors.deadlineDate)}
                    helperText={formik.touched.deadlineDate && formik.errors.deadlineDate}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="column" xs={5}>
                <Grid item container xs={12} direction="column" alignItems="flex-start">
                  <Grid item>
                    <Typography>Assignees: </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl variant="standard" className={classes.formControl}>
                      <Select
                        name="employees"
                        value={formik.values.employees}
                        onChange={formik.handleChange}
                        renderValue={(selected) => (
                          <div className={classes.chips}>
                            {(selected as string[]).map((value) => (
                              <Typography variant="subtitle2" className={classes.chip} gutterBottom>
                                {value}
                              </Typography>
                            ))}
                          </div>
                        )}
                        multiple
                      >
                        {employeeList.map((employee: any) => {
                          return <MenuItem value={employee}>{employee}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container xs={12} direction="row" justifyContent="flex-start" alignItems="flex-end">
                  <Grid item xs={2}>
                    <Typography>Project: </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <TextField
                        label="Project"
                        name="projectId"
                        id="projectId-select"
                        value={formik.values.projectId}
                        onChange={formik.handleChange}
                        select
                      >
                        <MenuItem key="" value="" disabled>
                          <em>None</em>
                        </MenuItem>
                        {projectList.map((project: any) => {
                          return <MenuItem value={project.id}>{project.title}</MenuItem>;
                        })}
                      </TextField>
                    </FormControl>
                  </Grid>
                </Grid>
                <Grid item container xs={12} direction="row" justifyContent="flex-start" alignItems="flex-end">
                  <Grid item xs={2}>
                    <Typography>Status: </Typography>
                  </Grid>
                  <Grid item>
                    <FormControl variant="outlined" className={classes.formControl}>
                      <TextField
                        label="Status"
                        name="status"
                        id="status-select"
                        value={formik.values.status}
                        onChange={formik.handleChange}
                        select
                        disabled={!(editState && id)}
                      >
                        <MenuItem value={TaskStatus.NEW}>New</MenuItem>
                        <MenuItem value={TaskStatus.ACTIVE}>Active</MenuItem>
                        <MenuItem value={TaskStatus.RESOLVED}>Resolved</MenuItem>
                        <MenuItem value={TaskStatus.CLOSED}>Closed</MenuItem>
                        <MenuItem value={TaskStatus.REMOVED}>Removed</MenuItem>
                      </TextField>
                    </FormControl>
                  </Grid>
                </Grid>
                <Divider light />
                <Grid item container xs={12} direction="row" justifyContent="flex-start" alignItems="center">
                  <Grid item xs={1}></Grid>
                  <Grid item>
                    <Button color="secondary" id="deleteButton" onClick={onClickDelete} disabled={!(editState && id)}>
                      Delete
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                {created && (
                  <Typography variant="h6" color="primary">
                    Created succesfully
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12}>
                {editState && id ? (
                  <Button color="primary" variant="contained" type="submit" id="save">
                    Save
                  </Button>
                ) : (
                  <Button color="primary" variant="contained" id="submitButton" type="submit">
                    Add
                  </Button>
                )}
                &nbsp; &nbsp;
                <Button color="primary" variant="outlined" onClick={onClickCancel}>
                  Cancel
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{'Delete this Task?'}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this Task? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button id="dialogDelete" onClick={handleClickConfirm} color="secondary">
            Delete
          </Button>
          <Button id="dialogCancel" onClick={handleClose} color="primary" autoFocus>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageTask;
