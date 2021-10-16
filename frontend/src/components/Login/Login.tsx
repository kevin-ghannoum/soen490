import { AppBar, Button, Grid, Paper, TextField, Toolbar, Typography } from '@material-ui/core';
import useStyles from './LoginStyle';
import { FormikProps, useFormik } from 'formik';
import loginSchema from './LoginFormValidationSchema';

interface loginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {

  const formik: FormikProps<loginFormData> = useFormik<loginFormData>({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {},
    validationSchema: loginSchema,
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
      <Grid item container spacing={3} direction="row" xs={12}>
        <AppBar className={classes.loginAppBar}>
          <Toolbar>
            <Grid item xs={3}>
              <Button size="large" variant="text" color="primary" className={classes.loginAppBarButton}>
                About Us
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button size="large" variant="text" color="primary" className={classes.loginAppBarButton}>
                Our Services
              </Button>
            </Grid>
            <Grid item xs={3}>
              <img
                width="70%"
                height="100%"
                alt="Logo"
                src="https://cdn.discordapp.com/attachments/885685523954401340/898984798649974834/Logo_Blue.png"
              />
            </Grid>
            <Grid item xs={3}>
              <Button size="large" variant="text" color="primary" className={classes.loginAppBarButton}>
                Our Work
              </Button>
            </Grid>
            <Grid item xs={3}>
              <Button size="large" variant="contained" color="primary" className={classes.loginAppBarContainedButton}>
                Book Now
              </Button>
            </Grid>
          </Toolbar>
        </AppBar>
      </Grid>

      <Paper elevation={3} className={classes.loginPaper}>
        <Grid item xs={12}>
          <Paper square className={classes.blueBox} />
        </Grid>
        <form onSubmit={formik.handleSubmit}>
          <Grid item container spacing={4} direction="row" xs={12} className={classes.loginFormWrapper}>
            <Grid item xs={12}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Login
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.email}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type="password"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.password}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <Button size="large" variant="contained" color="primary" type="submit" className={classes.loginButton}>
                Login
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default Login;
