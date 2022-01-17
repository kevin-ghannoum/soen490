import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  MenuItem,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  FormControl,
  Switch,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { getAllEmployeeAccountsByEmail, getAllRegexEmployeeAccount } from '../../../services/AccountAPI';
import {
  createLogHours,
  getInputTypeByEmail,
  getLatestPayByEmail,
  getPayById,
  updatePay,
} from '../../../services/LogHoursAPI';
import { ScheduledDay } from '../../../dto/LogHours/EmployeeHoursInputTypeDTOs';
import { PayStatus } from '../../../dto/LogHours/PayDTOs';
import logHoursFormValidationSchema from './LogHoursFormValidationSchema';
import logHoursStyle from './LogHoursStyle';
import { selectAccount } from '../../../features/account/AccountSlice';
import { useAppSelector } from '../../../redux/hooks';
import { AxiosResponse } from 'axios';

interface Props {
  editMode: boolean;
  id?: string;
}

const LogHours: React.FunctionComponent<Props> = ({ editMode, id }) => {
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [returnMessage, setReturnMessage] = useState<string>('');
  const [submitText, setSubmitText] = useState<string>('');
  const [employeeList, setEmployeeList] = useState<string[]>([]);
  const [emailList, setEmailList] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [, setLatestPayInfo] = useState({
    automatic: false,
    startDate: '',
    endDate: '',
    hoursWorked: '',
    paidAmount: '',
    status: PayStatus.NOT_PAID,
  });
  const [, setPaidAmount] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      email: '',
      automatic: false,
      scheduledDay: ScheduledDay.SUNDAY,
      startDate: '',
      endDate: '',
      hoursWorked: '',
      paidAmount: '',
      status: PayStatus.NOT_PAID,
    },
    onSubmit: async (values) => {
      if (editMode) {
        submitEdit();
      } else {
        const obj = {
          employeeHoursInputType: {
            email: values.email,
            automatic: values.automatic,
            scheduledDay: values.scheduledDay,
          },
          pay: {
            issueDate: new Date(),
            hoursWorked: Number(values.hoursWorked),
            status: values.status,
            periodStart: values.startDate,
            periodEnd: values.endDate,
            email: values.email,
            amount: Number(values.paidAmount),
          },
        };
        const response = await createLogHours(obj);
        if (response.status === 201) {
          setSuccess(true);
          setReturnMessage('Created succesfully');
        }
      }
    },
    validationSchema: logHoursFormValidationSchema,
  });

  const account = useAppSelector(selectAccount);

  useEffect(() => {
    const fetchEmployees = async () => {
      const responseEmployees = await getAllEmployeeAccountsByEmail(account.account.email);
      const employees = [];
      const emails = [];
      for (let employee of responseEmployees.data) {
        employees.push(employee.account.username);
        emails.push(employee.email);
      }
      setEmployeeList(employees);
      setEmailList(emails);
    };
    if (!editMode) {
      fetchEmployees();
      setSubmitText('Add');
    }
  }, [editMode, account.account.email]);

  useEffect(() => {
    const updateAutomaticByEmail = async (userEmail: string) => {
      formik.setFieldValue('email', userEmail);
      formik.setFieldValue('automatic', false);
      formik.setFieldValue('scheduledDay', ScheduledDay.SUNDAY);
      formik.setFieldValue('startDate', '');
      formik.setFieldValue('endDate', '');
      formik.setFieldValue('hoursWorked', '');
      formik.setFieldValue('paidAmount', '');
      formik.setFieldValue('status', PayStatus.NOT_PAID);
      if (!!userEmail) {
        const responseInputType = await getInputTypeByEmail(userEmail);
        const responseLatestPayInfo = await getLatestPayByEmail(userEmail);
        if (!!responseInputType.data) {
          formik.setFieldValue('automatic', responseInputType.data.automatic);
          formik.setFieldValue('scheduledDay', responseInputType.data.scheduledDay || ScheduledDay.SUNDAY);
        }
        if (!!responseLatestPayInfo.data) {
          formik.setFieldValue('startDate', responseLatestPayInfo.data.periodStart);
          formik.setFieldValue('endDate', responseLatestPayInfo.data.periodEnd);
          formik.setFieldValue('hoursWorked', responseLatestPayInfo.data.hoursWorked);
          formik.setFieldValue('paidAmount', responseLatestPayInfo.data.amount);
          formik.setFieldValue('status', responseLatestPayInfo.data.status);
        }
      } else {
        formik.setFieldValue('email', '');
      }
      setLatestPayInfo({
        automatic: formik.values.automatic,
        startDate: formik.values.startDate,
        endDate: formik.values.endDate,
        hoursWorked: formik.values.hoursWorked,
        paidAmount: formik.values.paidAmount,
        status: formik.values.status,
      });
    };
    updateAutomaticByEmail(currentEmail);
    // eslint-disable-next-line
  }, [currentEmail, formik.setFieldValue]);

  useEffect(() => {
    const email = emailList[employeeList.findIndex((employee) => employee === username)];
    setCurrentEmail(email);
  }, [username, emailList, employeeList]);

  const updatePaidAmout = async () => {
    const responseEmployee = await getAllRegexEmployeeAccount(formik.values.email);
    const hourlyWage = responseEmployee.data[0].hourlyWage;
    const paidAmount = +formik.values.hoursWorked * hourlyWage;
    formik.setFieldValue('paidAmount', paidAmount);
    setPaidAmount(formik.values.paidAmount);
  };

  useEffect(() => {
    const autofill = async () => {
      if (id) {
        const responsePay = await getPayById(id);
        formik.setFieldValue('startDate', responsePay.data.periodStart);
        formik.setFieldValue('endDate', responsePay.data.periodEnd);
        formik.setFieldValue('hoursWorked', responsePay.data.hoursWorked);
        formik.setFieldValue('paidAmount', responsePay.data.amount);
        formik.setFieldValue('status', responsePay.data.status);
        formik.setFieldValue('email', responsePay.data.email);
      } else {
        setError(true);
      }
    };
    if (editMode) {
      autofill();
      setSubmitText('Save');
    }
    // eslint-disable-next-line
  }, [formik.setFieldValue]);

  const submitEdit = async () => {
    if (id) {
      const response: AxiosResponse<any> = await updatePay(id, {
        hoursWorked: Number(formik.values.hoursWorked),
        status: formik.values.status,
        periodStart: formik.values.startDate,
        periodEnd: formik.values.endDate,
        email: formik.values.email,
        amount: Number(formik.values.paidAmount),
      });
      if (response.status === 200) {
        setSuccess(true);
        setReturnMessage('Saved succesfully');
      }
    } else {
      setError(true);
    }
  };

  const classes = logHoursStyle();
  return (
    <Grid
      id="LogHours-Grid"
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Paper elevation={3} className={classes.logHoursPaper}>
        <form onSubmit={formik.handleSubmit}>
          <Grid item container spacing={3} direction="row" className={classes.logHoursFormWrapper}>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.title}>
                Log Hours
              </Typography>
            </Grid>

            {!editMode && (
              <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                  <Autocomplete
                    value={username}
                    options={employeeList}
                    getOptionSelected={(option, value) => {
                      return option.toString === value.toString;
                    }}
                    onChange={(e, value) => {
                      setUsername(value || '');
                    }}
                    renderInput={(params) => (
                      <TextField
                        name="email"
                        {...params}
                        label="Employee"
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            )}
            {!editMode && (
              <Grid item xs={12} sm={6}>
                <FormControlLabel
                  name="automatic"
                  value={formik.values.automatic}
                  checked={formik.values.automatic}
                  control={
                    <Switch
                      classes={{
                        switchBase: classes.switch_base,
                      }}
                    />
                  }
                  label="Automatically log weekly"
                  labelPlacement="start"
                  onChange={formik.handleChange}
                  className={classes.automaticContainer}
                />
              </Grid>
            )}
            {formik.values.automatic && (
              <Grid item xs={12} sm={6}>
                <FormControl className={classes.formControl}>
                  <TextField
                    select
                    name="scheduledDay"
                    label="Repeat on"
                    value={formik.values.scheduledDay}
                    onChange={formik.handleChange}
                  >
                    <MenuItem value={ScheduledDay.MONDAY}>Monday</MenuItem>
                    <MenuItem value={ScheduledDay.TUESDAY}>Tuesday</MenuItem>
                    <MenuItem value={ScheduledDay.WEDNESDAY}>Wednesday</MenuItem>
                    <MenuItem value={ScheduledDay.THURSDAY}>Thursday</MenuItem>
                    <MenuItem value={ScheduledDay.FRIDAY}>Friday</MenuItem>
                    <MenuItem value={ScheduledDay.SATURDAY}>Saturday</MenuItem>
                    <MenuItem value={ScheduledDay.SUNDAY}>Sunday</MenuItem>
                  </TextField>
                </FormControl>
              </Grid>
            )}

            {!formik.values.automatic && (
              <Grid item container direction="row" spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="startDate"
                    type="date"
                    label="Period start date"
                    fullWidth
                    value={formik.values.startDate}
                    InputLabelProps={{ shrink: true }}
                    onChange={formik.handleChange}
                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}
                    helperText={formik.touched.startDate && formik.errors.startDate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="endDate"
                    type="date"
                    label="Period end date"
                    fullWidth
                    value={formik.values.endDate}
                    InputLabelProps={{ shrink: true }}
                    onChange={formik.handleChange}
                    error={formik.touched.endDate && Boolean(formik.errors.endDate)}
                    helperText={formik.touched.endDate && formik.errors.endDate}
                  />
                </Grid>
              </Grid>
            )}
            <Grid item container direction="row" spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Hours worked"
                  name="hoursWorked"
                  type="hoursWorked"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.hoursWorked}
                  error={formik.touched.hoursWorked && Boolean(formik.errors.hoursWorked)}
                  helperText={formik.touched.hoursWorked && formik.errors.hoursWorked}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Paid amount"
                  name="paidAmount"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.paidAmount}
                  error={formik.touched.paidAmount && Boolean(formik.errors.paidAmount)}
                  helperText={formik.touched.paidAmount && formik.errors.paidAmount}
                  InputProps={{
                    endAdornment: (
                      <Button className={classes.updateButton} onClick={updatePaidAmout}>
                        Update
                      </Button>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Grid item container direction="row">
              <Grid item xs={12} sm={6}>
                <FormLabel>Pay status</FormLabel>
              </Grid>
              <Grid item>
                <RadioGroup row defaultValue={formik.values.status}>
                  <Grid item>
                    <FormControlLabel
                      value={PayStatus.PAID}
                      control={<Radio className={classes.radio} />}
                      label="Paid"
                    />
                  </Grid>
                  <Grid item>
                    <FormControlLabel
                      value={PayStatus.NOT_PAID}
                      control={<Radio className={classes.radio} />}
                      label="Unpaid"
                    />
                  </Grid>
                </RadioGroup>
              </Grid>
            </Grid>
            <Grid container item xs={12} justifyContent="flex-end">
              {success && (
                <Typography variant="h6" color="primary" className={classes.successMessage}>
                  {returnMessage}
                </Typography>
              )}
              {error && (
                <Typography variant="h6" style={{ color: 'red' }}>
                  Error
                </Typography>
              )}
              {!editMode && (
                <Button color="primary" variant="contained" type="submit">
                  Add
                </Button>
              )}
              {editMode && (
                <Button color="primary" variant="contained" type="submit">
                  Save
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default LogHours;
