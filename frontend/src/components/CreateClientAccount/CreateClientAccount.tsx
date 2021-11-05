import { Button, Grid, Paper, Select, TextField, Typography, MenuItem } from '@material-ui/core';
import { FormikProps, useFormik } from 'formik';
import { useState } from 'react';
import { Status } from '../../dto/Accounts/AccountDTOs';
import { createClientAccount } from '../../services/AccountAPI';
import Sidebar from '../Sidebar/Sidebar';
import useStyles from './CreateClientAccountStyle';
import createClientAccountSchema from './CreateClientFormValidationSchema';
interface CreateClientAccountFormData {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  civicNumber: number | string;
  streetName: string;
  postalCode: string;
  cityName: string;
  province: string;
  country: string;
  businessName: string;
  industry: string;
  website: string;
  socialMediaName: string;
  socialMediaLink: string;
  status: string;
}

const CreateClientAccount: React.FC = () => {
  const [created, setCreated] = useState<boolean>(false);
  const [errMessage, setErrMessage] = useState<string>('');
  const statusValue: Array<{ value: string; label: string }> = [
    { value: 'LEAD', label: 'Lead' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'REJECTED', label: 'Rejected' },
    { value: 'TO BE RESCHEDULED', label: 'To be rescheduled' },
    { value: 'PENDING', label: 'Pending' },
  ];
  const formik: FormikProps<CreateClientAccountFormData> = useFormik<CreateClientAccountFormData>({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      username: '',
      password: '',
      phone: '',
      civicNumber: '',
      streetName: '',
      postalCode: '',
      cityName: '',
      province: '',
      country: '',
      businessName: '',
      industry: '',
      website: '',
      socialMediaLink: '',
      socialMediaName: '',
      status: 'PENDING',
    },
    onSubmit: async (values) => {
      try {
        await createClientAccount({
          account: {
            email: values.email,
            firstName: values.firstName,
            lastName: values.lastName,
            phoneNumber: values.phone,
            username: values.username,
            password: values.password,
          },
          address: {
            civicNumber: values.civicNumber,
            streetName: values.streetName,
            postalCode: values.postalCode,
            cityName: values.cityName,
            province: values.province,
            country: values.country,
          },
          businessName: values.businessName,
          industry: values.industry,
          website: values.website,
          status: Status[values.status as keyof typeof Status],
          socialMediaInfo: {
            name: values.socialMediaName,
            link: values.socialMediaLink,
          },
        });

        setCreated(true);
      } catch (err: any) {
        if (err.response.data.status === 500) {
          setErrMessage('Unexpected error');
        } else if (err.response.data.message) {
          setErrMessage(err.response.data.message);
        }
      }
    },
    validationSchema: createClientAccountSchema,
  });

  const classes = useStyles();

  return (
    <>
      <Sidebar />
      <Grid
        id="CreateClientAccount-Grid"
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: '100vh', paddingTop: '75px' }}
      >
        <Paper elevation={3} className={classes.createClientPaper}>
          <form onSubmit={formik.handleSubmit}>
            <Grid item container spacing={3} direction="row" xs={12} className={classes.createClientFormWrapper}>
              <Grid item xs={12}>
                <Typography variant="h5">New Client Account</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="First name *"
                  name="firstName"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.firstName}
                  error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                  helperText={formik.touched.firstName && formik.errors.firstName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Last name *"
                  name="lastName"
                  fullWidth
                  error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                  helperText={formik.touched.lastName && formik.errors.lastName}
                  onChange={formik.handleChange}
                  value={formik.values.lastName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Username *"
                  name="username"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.username}
                  error={formik.touched.username && Boolean(formik.errors.username)}
                  helperText={formik.touched.username && formik.errors.username}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Password *"
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
                <TextField
                  label="Email *"
                  name="email"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone *"
                  name="phone"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.phone}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                  helperText={formik.touched.phone && formik.errors.phone}
                />
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: '0px', paddingTop: '24px' }}>
                <Typography variant="h6">Address</Typography>
              </Grid>
              <Grid item xs={6} style={{ paddingTop: '0px' }}>
                <TextField
                  label="Civic number *"
                  name="civicNumber"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.civicNumber}
                  error={formik.touched.civicNumber && Boolean(formik.errors.civicNumber)}
                  helperText={formik.touched.civicNumber && formik.errors.civicNumber}
                />
              </Grid>
              <Grid item xs={6} style={{ paddingTop: '0px' }}>
                <TextField
                  label="Street name *"
                  name="streetName"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.streetName}
                  error={formik.touched.streetName && Boolean(formik.errors.streetName)}
                  helperText={formik.touched.streetName && formik.errors.streetName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City *"
                  name="cityName"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.cityName}
                  error={formik.touched.cityName && Boolean(formik.errors.cityName)}
                  helperText={formik.touched.cityName && formik.errors.cityName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Province *"
                  name="province"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.province}
                  error={formik.touched.province && Boolean(formik.errors.province)}
                  helperText={formik.touched.province && formik.errors.province}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Postal code *"
                  name="postalCode"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.postalCode}
                  error={formik.touched.postalCode && Boolean(formik.errors.postalCode)}
                  helperText={formik.touched.postalCode && formik.errors.postalCode}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Country *"
                  name="country"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.country}
                  error={formik.touched.country && Boolean(formik.errors.country)}
                  helperText={formik.touched.country && formik.errors.country}
                />
              </Grid>
              <Grid item xs={12} style={{ paddingBottom: '0px', paddingTop: '24px' }}>
                <Typography variant="h6">Business Information</Typography>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Company name *"
                  name="businessName"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.businessName}
                  error={formik.touched.businessName && Boolean(formik.errors.businessName)}
                  helperText={formik.touched.businessName && formik.errors.businessName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Industry *"
                  name="industry"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.industry}
                  error={formik.touched.industry && Boolean(formik.errors.industry)}
                  helperText={formik.touched.industry && formik.errors.industry}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Social media name"
                  name="socialMediaName"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.socialMediaName}
                  error={formik.touched.socialMediaName && Boolean(formik.errors.socialMediaName)}
                  helperText={formik.touched.socialMediaName && formik.errors.socialMediaName}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Link"
                  name="socialMediaLink"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.socialMediaLink}
                  error={formik.touched.socialMediaLink && Boolean(formik.errors.socialMediaLink)}
                  helperText={formik.touched.socialMediaLink && formik.errors.socialMediaLink}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Website link"
                  name="website"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.website}
                  error={formik.touched.website && Boolean(formik.errors.website)}
                  helperText={formik.touched.website && formik.errors.website}
                />
              </Grid>
              <Grid item xs={3}>
                <Typography align="left">Client Status:</Typography>
              </Grid>
              <Grid item xs={3}>
                <Select
                  id="select-status"
                  fullWidth
                  name="status"
                  value={formik.values.status}
                  onChange={formik.handleChange}
                  error={formik.touched.status && Boolean(formik.errors.status)}
                >
                  {statusValue.map((status) => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid item xs={12}>
                {created && (
                  <Typography variant="h6" color="primary">
                    Created succesfully
                  </Typography>
                )}
                {errMessage && (
                  <Typography variant="h6" color="error">
                    {errMessage}
                  </Typography>
                )}
                <Button color="primary" variant="contained" type="submit">
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </>
  );
};

export default CreateClientAccount;
