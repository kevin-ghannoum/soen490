import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Chip,
  FormHelperText,
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { AxiosResponse } from 'axios';
import { Form, Formik, FormikProps, useFormik } from 'formik';
import _ from './TaskStyle';
import { TaskStatus } from '../../dto/TaskDTOs';
import { createTask, getTaskById, updateTaskById } from '../../services/TaskAPI';
import { getAllBusinessProject } from '../../services/ProjectAPI';
import createTaskFromSchema from './CreateTaskFormValidation';
import { getAllEmployeeAccounts } from '../../services/AccountAPI';
import { createAssignment, getAssignedByTaskId, updateAssignedByTaskId } from '../../services/AssignedAPI';
import { useHistory } from 'react-router';

const ManageTask: React.FC<any> = ({ id, edit }) => {
  const [created, setCreated] = useState<boolean>(false);
  const [projectList, setProjectList] = useState<any>([]);
  const [employeeList, setEmployeeList] = useState<string[]>([]);
  //merci lauren
  const [editState, setEditState] = useState<boolean>(edit);
  const [creationDate, setCreationDate] = useState<string>('');

  const history = useHistory();

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
          createdDate: creationDate.split('T')[0],
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
          const taskData = taskToEdit.data;
          let tempEmployees: string[] = [];

          employees.data.forEach((element: any) => {
            tempEmployees.push(element.email);
          });

          //mega efficient (use moment.js or smt for dates)
          let deadDate: Date = new Date(Date.parse(taskData.deadlineDate));
          formik.setFieldValue('title', taskData.title);
          formik.setFieldValue('status', taskData.status);
          formik.setFieldValue('description', taskData.description);
          formik.setFieldValue('deadlineDate', deadDate.toISOString().split('T')[0]);
          formik.setFieldValue('projectId', taskData.projectId);
          formik.setFieldValue('employees', tempEmployees);
          setCreationDate(taskData.createdDate);
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
  }, []);

  const classes = _.editTaskStyles();
  return (
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
              <Grid item container xs={12} direction="row" alignItems="baseline">
                <Grid item>
                  <Typography>Assignees: </Typography>
                </Grid>
                <Grid item>
                  <FormControl variant="standard" className={classes.formControl}>
                    {/* <InputLabel>Employees</InputLabel> */}
                    <Select
                      name="employees"
                      value={formik.values.employees}
                      onChange={formik.handleChange}
                      renderValue={(selected) => (
                        <div className={classes.chips}>
                          {(selected as string[]).map((value) => (
                            <Chip key={value} label={value} className={classes.chip} />
                          ))}
                        </div>
                      )}
                      multiple
                    >
                      {/* <MenuItem key="" value="" disabled>
                      <em>None</em>
                    </MenuItem> */}
                      {employeeList.map((employee: any) => {
                        return <MenuItem value={employee}>{employee}</MenuItem>;
                      })}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid item container xs={12} direction="row" alignItems="flex-end">
                <Typography>Select Project: </Typography>
                <FormControl variant="outlined" className={classes.formControl}>
                  {/* <InputLabel id="demo-simple-select-outlined-label">Project</InputLabel> */}
                  <TextField
                    label="Project"
                    name="projectId"
                    id="demo-simple-select-outlined"
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
            <Grid item xs={12}>
              {created && (
                <Typography variant="h6" color="primary">
                  Created succesfully
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              {editState ? (
                <Button color="primary" variant="contained" type="submit" id="save">
                  Save
                </Button>
              ) : (
                <Button color="primary" variant="contained" id="submitButton" type="submit">
                  Add
                </Button>
              )}
              {/* <Button color="primary" type="submit" variant="contained">
                {editState ? 'Edit' : 'Add'}
              </Button> */}
              &nbsp; &nbsp;
              <Button color="primary" variant="outlined" onClick={onClickCancel}>
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default ManageTask;
