import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { useFormik } from 'formik';
import createEmployeeSchema from './CreateEmployeeFormValidationSchema';
import useStyles from './CreateEmployeeStyle';
const CreateEmployee: React.FunctionComponent = () => {
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      phone: '',
      supervisorEmail: '',
      civicNumber: '',
      streetName: '',
      postalCode: '',
      cityName: '',
      province: '',
      country: '',
      title: '',
      hourlyWage: '',
    },
    onSubmit: (values) => {
      console.log(values);
    },
    validationSchema: createEmployeeSchema,
  });

  const classes = useStyles();
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '100vh' }}
    >
      <Paper elevation={3} className={classes.createEmployeePaper}>
        <form onSubmit={formik.handleSubmit}>
          <Grid item container spacing={3} direction="row" xs={12} className={classes.createEmployeeFormWrapper}>
            <Grid item xs={12}>
              <Typography variant="h5">New Employee</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="First name"
                name="firstName"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.firstName}
              />
              {formik.touched.firstName && formik.errors.firstName ? (
                <Typography color="error">{formik.errors.firstName}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Last name"
                name="lastName"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.lastName}
              />
              {formik.touched.lastName && formik.errors.lastName ? (
                <Typography color="error">{formik.errors.lastName}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.email}
              />
              {formik.touched.email && formik.errors.email ? (
                <Typography color="error">{formik.errors.email}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Username"
                name="username"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username ? (
                <Typography color="error">{formik.errors.username}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.password}
              />
              {formik.touched.password && formik.errors.password ? (
                <Typography color="error">{formik.errors.password}</Typography>
              ) : null}
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.phone}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <Typography color="error">{formik.errors.phone}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Title"
                name="title"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.title}
              />
              {formik.touched.title && formik.errors.title ? (
                <Typography color="error">{formik.errors.title}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Hourly Wage"
                name="hourlyWage"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.hourlyWage}
              />
              {formik.touched.hourlyWage && formik.errors.hourlyWage ? (
                <Typography color="error">{formik.errors.hourlyWage}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Supervisor email"
                name="supervisorEmail"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.supervisorEmail}
              />
              {formik.touched.supervisorEmail && formik.errors.supervisorEmail ? (
                <Typography color="error">{formik.errors.supervisorEmail}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="h5">Address</Typography>
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Civic number"
                name="civicNumber"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.civicNumber}
              />
              {formik.touched.civicNumber && formik.errors.civicNumber ? (
                <Typography color="error">{formik.errors.civicNumber}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Street name"
                name="streetName"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.streetName}
              />
              {formik.touched.streetName && formik.errors.streetName ? (
                <Typography color="error">{formik.errors.streetName}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Postal code"
                name="postalCode"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.postalCode}
              />
              {formik.touched.postalCode && formik.errors.postalCode ? (
                <Typography color="error">{formik.errors.postalCode}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="City"
                name="cityName"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.cityName}
              />
              {formik.touched.cityName && formik.errors.cityName ? (
                <Typography color="error">{formik.errors.cityName}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Province"
                name="province"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.province}
              />
              {formik.touched.province && formik.errors.province ? (
                <Typography color="error">{formik.errors.province}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Country"
                name="country"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.country}
              />
              {formik.touched.country && formik.errors.country ? (
                <Typography color="error">{formik.errors.country}</Typography>
              ) : null}
            </Grid>
            <Grid item xs={12}>
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

export default CreateEmployee;
