import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  Select,
  MenuItem,
  InputLabel,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
  FormControl,
  Switch,
} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import { Formik, useFormik, useFormikContext, Field, FormikProvider } from 'formik';
import { useEffect, useState } from 'react';
import { createEmployeeAccount, getAllEmployeeAccounts } from '../../services/AccountAPI';
import logHoursSchema from './LogHoursFormValidationSchema';
import useStyles from './LogHoursStyle';
import { createLogHours, getInputTypeByEmail, getLatestPayByEmail } from '../../services/LogHoursAPI';
import { values } from 'cypress/types/lodash';
import { ScheduledDay } from '../../dto/LogHours/EmployeeHoursInputTypeDTOs';
import { PayStatus } from '../../dto/LogHours/PayDTOs';
const LogHours: React.FunctionComponent = () => {
  const [created, setCreated] = useState<boolean>(false);
  const [employeeList, setEmployeeList] = useState<string[]>([]);
  const [email, setEmail] = useState<string>('');
  const [latestPayInfo, setLatestPayInfo] = useState({
    automatic: false,
    startDate: '',
    endDate: '',
    hoursWorked: '',
    paidAmount: '',
    status: PayStatus.NOT_PAID,
  });

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
        setCreated(true);
      }
    },
    validationSchema: logHoursSchema,
  });

  useEffect(() => {
    const fetchEmployeeEmails =  async () => {
      const responseEmployees = await getAllEmployeeAccounts();
      const employeeEmails= [];
      for (let employee of responseEmployees.data) {
        employeeEmails.push(employee.email)
      }
      setEmployeeList(employeeEmails);
    }
    fetchEmployeeEmails();
  }, [])

  useEffect(() => {
    const updateAutomaticByEmail = async (email: string) => {
      formik.values.email = email;
      formik.values.automatic = false;
      formik.values.scheduledDay = ScheduledDay.SUNDAY;
      formik.values.startDate = '';
      formik.values.endDate = '';
      formik.values.hoursWorked = '';
      formik.values.paidAmount = '';
      formik.values.status = PayStatus.NOT_PAID;
      if (!!email) {
        const responseInputType = await getInputTypeByEmail(email);
        const responseLatestPayInfo = await getLatestPayByEmail(email);
        if (!!responseInputType.data) {
          formik.values.automatic = responseInputType.data.automatic;
          formik.values.scheduledDay = responseInputType.data.scheduledDay || ScheduledDay.SUNDAY;

          formik.values.startDate = responseLatestPayInfo.data.periodStart;
          formik.values.endDate = responseLatestPayInfo.data.periodEnd;
          formik.values.hoursWorked = responseLatestPayInfo.data.hoursWorked;
          formik.values.paidAmount = responseLatestPayInfo.data.amount;
          formik.values.status = responseLatestPayInfo.data.status;
        }
      } else {
        formik.values.email = '';
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
    updateAutomaticByEmail(email);
  }, [email]);

  const classes = useStyles();
  return (
    <Grid container justifyContent="center">
      <Paper elevation={3} className={classes.logHoursPaper}>
        <form onSubmit={formik.handleSubmit}>
          <Grid item container spacing={3} direction="row" className={classes.logHoursFormWrapper}>
            <Grid item xs={12}>
              <Typography variant="h5" className={classes.title}>
                Log Hours
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl className={classes.formControl}>
                <Autocomplete
                  value={email}
                  options={employeeList}
                  getOptionSelected={(option, value) => {
                    return option.toString === value.toString;
                  }}
                  onChange={(e, value) => {
                    setEmail(value || '');
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Employee email"
                      error={formik.touched.email && Boolean(formik.errors.email)}
                      helperText={formik.touched.email && formik.errors.email}
                    />
                  )}
                />
              </FormControl>
            </Grid>
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
                label="Automatically repeat weekly"
                labelPlacement="start"
                onChange={formik.handleChange}
                className={classes.automaticContainer}
              />
            </Grid>
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
              {created && (
                <Typography variant="h6" color="primary" className={classes.successMessage}>
                  Created succesfully
                </Typography>
              )}
              <Button color="primary" variant="contained" type="submit">
                Add
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default LogHours;
