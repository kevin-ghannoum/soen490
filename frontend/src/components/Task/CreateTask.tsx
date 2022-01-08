import {
  Button,
  FormControl,
  Grid,
  MenuItem,
  Paper,
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
import taskStyle from './TaskStyle';
import { TaskStatus } from '../../dto/TaskDTOs';
import { createTask, deleteTaskById, getTaskById, updateTaskById } from '../../services/TaskAPI';
import { getAllBusinessProject } from '../../services/ProjectAPI';
import createTaskFormValidationSchema from './CreateTaskFormValidationSchema';
import { getAllRegexEmployeeAccount } from '../../services/AccountAPI';
import {
  createAssignment,
  deleteAssignedByTaskId,
  getAssignedByTaskId,
  updateAssignedByTaskId,
} from '../../services/AssignedAPI';
import { useHistory } from 'react-router';
import { Autocomplete, AutocompleteInputChangeReason } from '@material-ui/lab';
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

const CreateTask: React.FC<any> = ({ id, edit }) => {
  const [created, setCreated] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<any>([]);
  const [employeeList, setEmployeeList] = useState<any>([]);
  const [assignees, setAssignees] = useState<any>([]);
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
  const onAssigneeChange = async (event: React.ChangeEvent<{}>, values: Object[]) => {
    values = values.filter(
      (elem: any, index, self) =>
        self.findIndex((t: any) => {
          return t.email === elem.email;
        }) === index
    );
    setAssignees(values);
    var emails: string[] = [];
    values.forEach((element: any) => {
      emails.push(element.email);
    });
    formik.setFieldValue('employees', emails);
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
    validationSchema: createTaskFormValidationSchema,
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

  const getEmployees = async (event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
    const tempEmployees: any[] = [];
    if (value !== '') {
      const employees = await getAllRegexEmployeeAccount(value);
      employees.data.forEach((element: any) => {
        tempEmployees.push({ label: `${element.account.username}`, email: `${element.account.email}` });
      });
    }
    setEmployeeList(tempEmployees);
  };

  useEffect(() => {
    if (editState && id) {
      const getEditTask = async () => {
        try {
          const taskToEdit = await getTaskById(id);
          const taskData: Task = taskToEdit.data;
          let deadDate = new Date(Date.parse(taskData.deadlineDate));
          formik.setFieldValue('title', taskData.title);
          formik.setFieldValue('status', taskData.status);
          formik.setFieldValue('description', taskData.description);
          formik.setFieldValue('deadlineDate', deadDate.toISOString().split('T')[0]);
          formik.setFieldValue('projectId', taskData.projectId);

          const employees = await getAssignedByTaskId(id);
          let tempEmployees: string[] = [];
          let tempAssignees: any[] = [];
          employees.data.forEach((element: any) => {
            tempAssignees.push({ label: `${element.username}`, email: `${element.email}` });
            tempEmployees.push(element.email);
          });
          formik.setFieldValue('employees', tempEmployees);
          setAssignees(tempAssignees);
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
          deadlineDate: element.deadlineDate,
        });
      });
      setProjectList(tempProjects);
    };
    getProjects();
    // eslint-disable-next-line
  }, []);

  const classes = taskStyle.editTaskStyles();
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
                    label="Task Deadline"
                    name="deadlineDate"
                    type="date"
                    fullWidth
                    InputLabelProps={{
                      shrink: true,
                    }}
                    value={formik.values.deadlineDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.deadlineDate && Boolean(formik.errors.deadlineDate)}
                    helperText={formik.touched.deadlineDate && formik.errors.deadlineDate}
                  />
                </Grid>
              </Grid>
              <Grid item container spacing={2} direction="column" xs={5}>
                <Grid
                  item
                  container
                  xs={12}
                  direction="column"
                  alignItems="flex-start"
                  style={{ display: 'flex', marginTop: 6 }}
                >
                  <Typography>Assignees</Typography>
                  <Autocomplete
                    multiple
                    filterSelectedOptions
                    id="selectAssignees"
                    getOptionLabel={(option) => option.label}
                    onChange={onAssigneeChange}
                    onInputChange={getEmployees}
                    value={assignees}
                    options={employeeList}
                    className={classes.assigneeAutoComplete}
                    renderInput={(params) => <TextField {...params} variant="standard" size="small" />}
                  />
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
                          return (
                            <MenuItem
                              value={project.id}
                              onClick={(e) => {
                                formik.setFieldValue('deadlineDate', project.deadlineDate.split('T')[0]);
                              }}
                            >
                              {project.title}
                            </MenuItem>
                          );
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
                        <MenuItem value={TaskStatus.COMPLETE}>Complete</MenuItem>
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

export default CreateTask;
