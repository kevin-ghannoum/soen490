import React, { useEffect, useState } from 'react';
import {
  Button,
  FormHelperText,
  Grid,
  MenuItem,
  Paper,
  Select,
  styled,
  TextField,
  Typography,
} from '@material-ui/core';
import { FormikProps, useFormik } from 'formik';
import { AxiosResponse } from 'axios';
import { getAllClientAccount, getAllRegexEmployeeAccount } from '../../services/AccountAPI';
import { createProject, getProject, updateProject } from '../../services/ProjectAPI';
import createProjectFromSchema from './CreateProjectFormValidationSchema';
import useStyles from './CreateProjectStyle';
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';
import { useHistory } from 'react-router';
import { SaleCreationDTO } from '../../dto/SaleDTO';
// import Sidebar from '../Sidebar/Sidebar';

interface Props {
  id?: string;
  edit: string;
}

interface workson {
  email: string;
  id: number;
}

interface CreateProjectFormData {
  title: string;
  description: string;
  status: string;
  serviceType: string;
  leadSource: string;
  leadCredit: string;
  leadRanking: string;
  followUpDate: string;
  deadLineDate: string;
  extraNotes: string;
  email: string;
  saleDescription: string;
  saleValue: number | string;
  assignee: Object[] | undefined;
}

interface EditFetchData {
  id: number;
  businessId: string;
  createdDate: string;
  deadlineDate: string;
  description: string;
  email: string;
  extraNotes: string;
  followUpDate: string;
  leadCredit: string;
  leadRanking: string;
  leadSource: string;
  sale: SaleCreationDTO;
  serviceType: string;
  status: string;
  title: string;
}

const CreateProject: React.FC<Props> = ({ id, edit }) => {
  const [created, setCreated] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const date = new Date();
  const history = useHistory();
  const classes = useStyles();

  const formik: FormikProps<CreateProjectFormData> = useFormik<CreateProjectFormData>({
    onReset: () => {},
    initialValues: {
      title: '',
      description: '',
      status: '',
      serviceType: '',
      leadSource: '',
      leadCredit: '',
      leadRanking: '',
      followUpDate: date.toISOString().split('T')[0],
      deadLineDate: date.toISOString().split('T')[0],
      extraNotes: '',
      email: '',
      saleDescription: '',
      saleValue: '',
      assignee: [],
    },
    onSubmit: async (values) => {
      if (editState === 'true') {
        submitEdit();
      } else {
        try {
          const response: AxiosResponse<any> = await createProject({
            project: {
              title: values.title,
              description: values.description,
              status: values.status,
              serviceType: values.serviceType,
              leadSource: values.leadSource,
              leadCredit: values.leadCredit,
              leadRanking: values.leadRanking,
              deadlineDate: values.deadLineDate,
              followUpDate: values.followUpDate,
              extraNotes: values.extraNotes,
              email: values.email,
              businessId: 1,
              assignee: values.assignee,
            },
            sale: {
              amount: values.saleValue,
              description: values.saleDescription,
              dueDate: values.deadLineDate,
            },
          });
          if (response.status === 201) {
            setCreated(true);
            history.push('/projects');
          }
        } catch (error) {
          setError(true);
        }
      }
    },
    validationSchema: createProjectFromSchema,
  });

  const Input = styled('input')({
    display: 'none',
  });

  const [employeeList, setEmployeeList] = useState<Array<{ label: string }>>([]);
  const [assignee, setAssignee] = useState<any>([]);
  const [clientList, setClientList] = useState<any>([]);
  const [clientLoading, setClientLoading] = useState<boolean>(false);
  const [assigneeLoading, setAssigeeLoading] = useState<boolean>(false);
  const [editState, setEditState] = useState<string>(edit);
  const [disabled, setDisabled] = useState<boolean>(false);

  useEffect(() => {
    const getEditProjectData = async () => {
      if (id) {
        try {
          const projectToEdit = await getProject(id);
          const data: EditFetchData = projectToEdit.data[0];
          if (!projectToEdit.data || (editState !== 'true' && editState !== 'false')) {
            history.push('/error');
          }
          formik.setFieldValue('title', data.title);
          formik.setFieldValue('status', data.status);
          formik.setFieldValue('description', data.description);
          formik.setFieldValue('serviceType', data.serviceType);
          formik.setFieldValue('leadSource', data.leadSource);
          formik.setFieldValue('leadCredit', data.leadCredit);
          formik.setFieldValue('leadRanking', data.leadRanking);
          formik.setFieldValue('followUpDate', data.followUpDate.split('T')[0]);
          formik.setFieldValue('deadLineDate', data.deadlineDate.split('T')[0]);
          formik.setFieldValue('extraNotes', data.extraNotes);
          formik.setFieldValue('email', data.email);
          formik.setFieldValue('saleDescription', data.sale.description);
          formik.setFieldValue('saleValue', data.sale.amount);
          let array: Object[] = [];
          projectToEdit.data[1].forEach((element: workson) => {
            array.push({ label: element.email });
          });
          setAssignee(array);
        } catch (error) {
          history.push('/error');
        }
      }
    };
    getEditProjectData();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const getSelectDropDownData = async () => {
      setClientLoading(true);
      setAssigeeLoading(true);

      if (editState === 'false' && id) {
        setDisabled(true);
      } else {
        setDisabled(false);
      }
    };
    getSelectDropDownData();
  }, [id, editState]);

  const getClientInput = async (event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
    const clientResponse = await getAllClientAccount(value);
    const clients: any[] = [];
    clientResponse.data.forEach((element: any) => {
      clients.push(`${element.email}`);
    });
    setClientList([]);
    setClientList(clients);
  };

  const onAssigneeTagsChange = async (event: React.ChangeEvent<{}>, values: Object[]) => {
    values = values.filter(
      (elem: any, index, self) =>
        self.findIndex((t: any) => {
          return t.label === elem.label;
        }) === index
    );
    setAssignee(values);
    formik.setFieldValue('assignee', values);
  };

  const getEmployeeInput = async (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    const employeeResponse = await getAllRegexEmployeeAccount(value);
    const assignees: any[] = [];
    employeeResponse.data.forEach((element: any) => {
      assignees.push({ label: `${element.email}` });
    });
    setEmployeeList([]);
    setEmployeeList(assignees);
  };

  const reset = () => {
    setAssignee([]);
    formik.setFieldValue('assignee', null);
    formik.resetForm();
  };

  const handleErrorCreate = () => {
    if (created === true) {
      reset();
      history.push('/projects');
    }
  };

  const submitEdit = async () => {
    const response: AxiosResponse<any> = await updateProject({
      project: {
        title: formik.values.title,
        description: formik.values.description,
        status: formik.values.status,
        serviceType: formik.values.serviceType,
        leadSource: formik.values.leadSource,
        leadCredit: formik.values.leadCredit,
        leadRanking: formik.values.leadRanking,
        deadlineDate: formik.values.deadLineDate,
        followUpDate: formik.values.followUpDate,
        modifiedDate: undefined,
        extraNotes: formik.values.extraNotes,
        email: formik.values.email,
        id: Number(id),
        assignee: formik.values.assignee,
      },
      sale: {
        amount: formik.values.saleValue,
        description: formik.values.description,
        dueDate: formik.values.deadLineDate,
      },
    });

    if (response.status === 200) {
      setCreated(true);
      history.push('/projects');
    }
  };

  return (
    // <>
    //   <Sidebar />
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh', paddingTop: '75px' }}
    >
      <Paper elevation={3} className={classes.createProjectPaper}>
        <form onSubmit={formik.handleSubmit}>
          <Grid item container spacing={3} direction="row" xs={12} className={classes.createProjectFormWrapper}>
            <Grid item xs={12} style={{ marginTop: 20 }}>
              <label htmlFor="contained-button-file">
                <Input accept="image/*" id="contained-button-file" multiple type="file" />
                <Button className={classes.upload} variant="contained" color="secondary" component="span">
                  Upload Contract
                </Button>
              </label>
            </Grid>
            <Grid className={classes.assigneeWrapper} item xs={4} style={{ marginTop: 6 }}>
              <Typography className={classes.Typo} style={{ marginRight: 3 }}>
                Client
              </Typography>
              <Autocomplete
                loading={clientLoading}
                className={classes.selectBox}
                id="selectClient"
                loadingText="No Options"
                options={clientList}
                value={formik.values.email}
                onInputChange={getClientInput}
                onChange={(event, value) => formik.setFieldValue('email', value)}
                getOptionLabel={(option) => option}
                style={{ marginTop: 6, alignItems: 'center' }}
                renderInput={(params) => (
                  <TextField
                    error={formik.touched.email && Boolean(formik.errors.email)}
                    helperText={formik.touched.email && formik.errors.email}
                    {...params}
                    variant="standard"
                    style={{ alignContent: 'center' }}
                  />
                )}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={8} className={classes.assigneeWrapper} style={{ marginTop: 5 }}>
              <Typography className={classes.Typo}>Assignees</Typography>
              <Autocomplete
                loading={assigneeLoading}
                onInputChange={getEmployeeInput}
                loadingText="No Options"
                noOptionsText="No Options found"
                style={{ width: '90%' }}
                value={assignee}
                onChange={onAssigneeTagsChange}
                ListboxProps={{ style: { maxHeight: '10rem' }, position: 'bottom-start' }}
                multiple
                id="selectEmployee"
                options={employeeList}
                getOptionLabel={(option) => option.label}
                filterSelectedOptions
                renderInput={(params) => <TextField {...params} variant="standard" size="small" />}
                disabled={disabled}
              />
            </Grid>
            <Grid container item xs={4} className={classes.assigneeWrapper}>
              <Grid item xs={12} className={classes.assigneeWrapper}>
                <Typography className={classes.Typo}>Status</Typography>
                <Select
                  labelId="demo-simple-select-label"
                  id="selectStatus"
                  name="status"
                  className={classes.selectBox}
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                  disabled={disabled}
                >
                  <MenuItem id="booked" value={'BOOKED'}>
                    Booked
                  </MenuItem>
                  <MenuItem id="rejected" value={'REJECTED'}>
                    Rejected
                  </MenuItem>
                  <MenuItem id="toBeScheduled" value={'TO BE RESCHEDULED'}>
                    To Be Reschedule
                  </MenuItem>
                  <MenuItem id="pending" value={'PENDING'}>
                    Pending
                  </MenuItem>
                </Select>
              </Grid>
              <Grid item>
                {formik.touched.status && Boolean(formik.errors.status) && (
                  <FormHelperText style={{ color: 'red', marginLeft: 60 }}>Required</FormHelperText>
                )}
              </Grid>
            </Grid>
            <Grid item xs={8}></Grid>
            <Grid item xs={6} style={{ paddingBottom: '0px', paddingTop: '100px' }}>
              <Typography variant="h5" className={classes.projectTitle}>
                Project Specification
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ paddingBottom: '0px', paddingTop: '100px' }}>
              <Typography variant="h5" className={classes.projectTitle}>
                Project Description
              </Typography>
            </Grid>
            <Grid item xs={6} style={{ paddingTop: '20px' }}>
              <TextField
                onChange={formik.handleChange}
                value={formik.values.title}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
                label="Title *"
                name="title"
                fullWidth
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '20px' }}>
              <TextField
                label="Lead Source *"
                InputLabelProps={{ style: { fontSize: 12 } }}
                name="leadSource"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.leadSource}
                error={formik.touched.leadSource && Boolean(formik.errors.leadSource)}
                helperText={formik.touched.leadSource && formik.errors.leadSource}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '20px' }}>
              <TextField
                label="Lead Credit *"
                InputLabelProps={{ style: { fontSize: 12 } }}
                name="leadCredit"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.leadCredit}
                error={formik.touched.leadCredit && Boolean(formik.errors.leadCredit)}
                helperText={formik.touched.leadCredit && formik.errors.leadCredit}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={2} style={{ paddingTop: '20px' }}>
              <TextField
                label="Lead Ranking *"
                InputLabelProps={{ style: { fontSize: 12 } }}
                name="leadRanking"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.leadRanking}
                error={formik.touched.leadRanking && Boolean(formik.errors.leadRanking)}
                helperText={formik.touched.leadRanking && formik.errors.leadRanking}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6} style={{ paddingTop: '3px' }}>
              <TextField
                id="description"
                label="Description"
                name="description"
                variant="outlined"
                multiline
                rows={3}
                className={classes.descriptionBox}
                onChange={formik.handleChange}
                value={formik.values.description}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
                disabled={disabled}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Service Type *"
                name="serviceType"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.serviceType}
                error={formik.touched.serviceType && Boolean(formik.errors.serviceType)}
                helperText={formik.touched.serviceType && formik.errors.serviceType}
                disabled={disabled}
              />
              <TextField
                label="Sale value *"
                name="saleValue"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.saleValue}
                error={formik.touched.saleValue && Boolean(formik.errors.saleValue)}
                helperText={formik.touched.saleValue && formik.errors.saleValue}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="saleDescription"
                label="Sale Description"
                multiline
                variant="outlined"
                rows={2}
                name="saleDescription"
                className={classes.optionalDescriptionBox}
                onChange={formik.handleChange}
                value={formik.values.saleDescription}
                error={formik.touched.saleDescription && Boolean(formik.errors.saleDescription)}
                helperText={formik.touched.saleDescription && formik.errors.saleDescription}
                disabled={disabled}
              ></TextField>
              <TextField
                id="extraNotes"
                label="Extra Notes"
                multiline
                rows={2}
                variant="outlined"
                name="extraNotes"
                className={classes.optionalDescriptionBox}
                onChange={formik.handleChange}
                value={formik.values.extraNotes}
                error={formik.touched.extraNotes && Boolean(formik.errors.extraNotes)}
                helperText={formik.touched.extraNotes && formik.errors.extraNotes}
                disabled={disabled}
              ></TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField
                id="date"
                label="Follow Up Date"
                type="date"
                name="followUpDate"
                className={classes.dateFields}
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={formik.handleChange}
                value={formik.values.followUpDate}
                error={formik.touched.followUpDate && Boolean(formik.errors.followUpDate)}
                helperText={formik.touched.followUpDate && formik.errors.followUpDate}
                disabled={disabled}
              />
              <TextField
                id="date"
                label="Project Deadline"
                type="date"
                className={classes.dateFields}
                InputLabelProps={{
                  shrink: true,
                }}
                name="deadLineDate"
                onChange={formik.handleChange}
                value={formik.values.deadLineDate}
                error={formik.touched.deadLineDate && Boolean(formik.errors.deadLineDate)}
                helperText={formik.touched.deadLineDate && formik.errors.deadLineDate}
                disabled={disabled}
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: 40 }}>
              {editState === 'true' ? (
                <Button color="primary" variant="contained" type="submit" id="save">
                  Save
                </Button>
              ) : id ? (
                <Button
                  id="editButton"
                  color="primary"
                  variant="contained"
                  key="NotSubmit"
                  onClick={() => {
                    setEditState('true');
                  }}
                >
                  Edit
                </Button>
              ) : (
                <Button color="primary" variant="contained" id="submitButton" type="submit" onClick={handleErrorCreate}>
                  Create
                </Button>
              )}
              &nbsp; &nbsp;
              <Button disabled={disabled} type="reset" onClick={reset} color="primary" variant="outlined">
                Clear
              </Button>
            </Grid>
            <Grid item xs={12}>
              {created && (
                <Typography variant="h6" color="primary">
                  Created succesfully
                </Typography>
              )}
              {error && (
                <Typography variant="h6" style={{ color: 'red' }}>
                  Error
                </Typography>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
    // </>
  );
};

export default CreateProject;
