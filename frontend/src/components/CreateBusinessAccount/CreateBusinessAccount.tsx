import React, { useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { FormikProps, useFormik } from 'formik';
import { AxiosResponse } from 'axios';
import { createBusinessAccount } from '../../services/AccountAPI';
import createBusinessFormValidationSchema from './CreateBusinessFormValidationSchema';
import createBusinessAccountStyle from './CreateBusinessAccountStyle';
const CreateBusinessAccount: React.FC = () => {
  const [created, setCreated] = useState<boolean>(false);

  interface CreateBusinessAccountFormData {
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
    name: string;
    industry: string;
    website: string;
    socialMediaName: string;
    socialMediaLink: string;
  }

  const formik: FormikProps<CreateBusinessAccountFormData> = useFormik<CreateBusinessAccountFormData>({
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
      name: '',
      industry: '',
      website: '',
      socialMediaLink: '',
      socialMediaName: '',
    },
    onSubmit: async (values) => {
      const response: AxiosResponse<any> = await createBusinessAccount({
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
        businessInfo: {
          name: values.name,
          industry: values.industry,
          website: values.website,
          email: values.email,
        },
        socialMediaInfo: {
          name: values.socialMediaName,
          link: values.socialMediaLink,
        },
      });
      if (response.status === 201) {
        setCreated(true);
      }
    },
    validationSchema: createBusinessFormValidationSchema,
  });

  const classes = createBusinessAccountStyle();
  return (
    <Grid
      container
      id="CreateBusinessAccount-Grid"
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
              <Typography variant="h5">New Business Account</Typography>
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
                label="Business Name *"
                name="name"
                fullWidth
                onChange={formik.handleChange}
                value={formik.values.name}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
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
            <Grid item xs={12}>
              {created && (
                <Typography variant="h6" color="primary">
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

export default CreateBusinessAccount;
