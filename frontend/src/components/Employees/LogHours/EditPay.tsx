import {
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
  RadioGroup,
  FormLabel,
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import { getAllRegexEmployeeAccount } from '../../../services/AccountAPI';
import useStyles from './LogHoursStyle';
import { getPayById, updatePay } from '../../../services/LogHoursAPI';
import { PayStatus } from '../../../dto/LogHours/PayDTOs';
import editPaySchema from './EditPayFormValidationSchema';

interface Props {
  id: string;
}

const EditPay: React.FunctionComponent<Props> = ({ id }) => {
  const [saved, setSaved] = useState<boolean>(false);
  const [, setPaidAmount] = useState<string>('');

  const formik = useFormik({
    initialValues: {
      email: '',
      startDate: '',
      endDate: '',
      hoursWorked: '',
      paidAmount: '',
      status: PayStatus.NOT_PAID,
    },
    onSubmit: async (values) => {
      const obj = {
        hoursWorked: Number(values.hoursWorked),
        status: values.status,
        periodStart: values.startDate,
        periodEnd: values.endDate,
        email: values.email,
        amount: Number(values.paidAmount),
      };
      const response = await updatePay(id, obj);
      if (response.status === 200) {
        setSaved(true);
      }
    },
    validationSchema: editPaySchema,
  });

  useEffect(() => {
    const autofill = async () => {
      const responsePay = await getPayById(id);
      formik.setFieldValue('startDate', responsePay.data.periodStart);
      formik.setFieldValue('endDate', responsePay.data.periodEnd);
      formik.setFieldValue('hoursWorked', responsePay.data.hoursWorked);
      formik.setFieldValue('paidAmount', responsePay.data.amount);
      formik.setFieldValue('status', responsePay.data.status);
      formik.setFieldValue('email', responsePay.data.email);
    };
    autofill();
  }, []);

  const updatePaidAmout = async () => {
    const responseEmployee = await getAllRegexEmployeeAccount(formik.values.email);
    const hourlyWage = responseEmployee.data[0].hourlyWage;
    const paidAmount = +formik.values.hoursWorked * hourlyWage;
    formik.setFieldValue('paidAmount', paidAmount);
    setPaidAmount(formik.values.paidAmount);
  };

  const classes = useStyles();
  return (
    <Grid
      id="EditPay-Grid"
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
              {saved && (
                <Typography variant="h6" color="primary" className={classes.successMessage}>
                  Saved succesfully
                </Typography>
              )}
              <Button color="primary" variant="contained" type="submit">
                Save
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default EditPay;
