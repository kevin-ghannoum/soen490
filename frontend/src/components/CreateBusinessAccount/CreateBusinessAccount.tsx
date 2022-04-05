import React, { useEffect, useState } from 'react';
import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { FormikProps, useFormik } from 'formik';
import { AxiosResponse } from 'axios';
import { createBusinessAccount } from '../../services/AccountAPI';
import createBusinessFormValidationSchema from './CreateBusinessFormValidationSchema';
import createBusinessAccountStyle from './CreateBusinessAccountStyle';
import { getBusiness, updateBusiness, updateBusinessPassword } from '../../services/BusinessAPI';

interface Props {
  editMode?: boolean;
  id?: string;
}

const CreateBusinessAccount: React.FC<Props> = ({ editMode, id }) => {
  const [created, setCreated] = useState<boolean>(false);
  const [submitText, setSubmitText] = useState<string>('');
  const [returnMessage, setReturnMessage] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [addressId, setAddressId] = useState<number>();
  const [socialMediaLink, setSocialMediaLink] = useState<string>('');
  const [socialMediaName, setSocialMediaName] = useState<string>('');
  const [title, setTitle] = useState<string>('');

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
      if (editMode) {
        submitEdit();
      } else {
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
          setReturnMessage('Created successfully');
        }
      }
    },
    validationSchema: createBusinessFormValidationSchema,
  });

  const submitEdit = async () => {
    if (id && addressId) {
      const response: AxiosResponse<any> = await updateBusiness(id, {
        business: {
          name: formik.values.name,
          industry: formik.values.industry,
          website: formik.values.website,
        },
        account: {
          email: formik.values.email,
          firstName: formik.values.firstName,
          lastName: formik.values.lastName,
          username: formik.values.username,
          phoneNumber: formik.values.phone,
        },
        address: {
          id: addressId,
          civicNumber: formik.values.civicNumber as number,
          streetName: formik.values.streetName,
          postalCode: formik.values.postalCode,
          cityName: formik.values.cityName,
          province: formik.values.province,
          country: formik.values.country,
        },
        socialMediaPage: {
          link: socialMediaLink,
          name: socialMediaName,
        },
        newSocialMediaPage: {
          link: formik.values.socialMediaLink,
          name: formik.values.socialMediaName,
          businessId: +id,
          email: formik.values.email,
        },
      });
      if (response.status === 200) {
        setCreated(true);
        setReturnMessage('Saved succesfully!');
      }
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    const autofill = async () => {
      if (id) {
        const responseBusiness = await getBusiness(id);
        formik.setFieldValue('firstName', responseBusiness.data.businessAccount.account.firstName);
        formik.setFieldValue('lastName', responseBusiness.data.businessAccount.account.lastName);
        formik.setFieldValue('email', responseBusiness.data.businessAccount.email);
        formik.setFieldValue('username', responseBusiness.data.businessAccount.account.username);
        formik.setFieldValue('password', "Password");
        formik.setFieldValue('phone', responseBusiness.data.businessAccount.account.phoneNumber);
        formik.setFieldValue('civicNumber', responseBusiness.data.businessAccount.account.address.civicNumber);
        formik.setFieldValue('streetName', responseBusiness.data.businessAccount.account.address.streetName);
        formik.setFieldValue('postalCode', responseBusiness.data.businessAccount.account.address.postalCode);
        formik.setFieldValue('cityName', responseBusiness.data.businessAccount.account.address.cityName);
        formik.setFieldValue('province', responseBusiness.data.businessAccount.account.address.province);
        formik.setFieldValue('country', responseBusiness.data.businessAccount.account.address.country);
        formik.setFieldValue('name', responseBusiness.data.name);
        formik.setFieldValue('industry', responseBusiness.data.industry);
        formik.setFieldValue('website', responseBusiness.data.website);
        if (responseBusiness.data.socialMediaPages.length > 0) {
          formik.setFieldValue('socialMediaLink', responseBusiness.data.socialMediaPages[0].link);
          formik.setFieldValue('socialMediaName', responseBusiness.data.socialMediaPages[0].name);
          setSocialMediaLink(responseBusiness.data.socialMediaPages[0].link);
          setSocialMediaName(responseBusiness.data.socialMediaPages[0].name);
        }
        setAddressId(responseBusiness.data.businessAccount.account.address.id);
      } else {
        setError(true);
      }
    };
    if (editMode) {
      autofill();
      setSubmitText('Save');
      setTitle('Edit Business');
    } else {
      setSubmitText('Add');
      setTitle('New Business Account');
    }
    // eslint-disable-next-line
  }, [formik.setFieldValue]);

  const handleChangePasswordClick = async () => {
    const response: AxiosResponse<any> = await updateBusinessPassword({
      account: {
        email: formik.values.email,
      },
    });
    if (response.status === 200) {
      setCreated(true);
      setReturnMessage('Link to password change sent!');
    }
  };

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
              <Typography variant="h5">{title}</Typography>
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
            {!editMode && (
              <Grid item xs={6}>
                <TextField
                  label="Password *"
                  name="password"
                  type="password"
                  fullWidth
                  onChange={formik.handleChange}
                  value={formik.values.password}
                  error={formik.touched.password && Boolean(formik.errors.password) && !editMode}
                  helperText={formik.touched.password && formik.errors.password && !editMode}
                />
              </Grid>
            )}
            {editMode && (
              <Grid item xs={6}>
                <Button color="primary" variant="contained" onClick={handleChangePasswordClick}>
                  Change password
                </Button>
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                label="Email *"
                name="email"
                fullWidth
                disabled={editMode}
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
                  {returnMessage}
                </Typography>
              )}
              {error && (
                <Typography variant="h6" style={{ color: 'red' }}>
                  Error
                </Typography>
              )}
              <Button color="primary" variant="contained" type="submit">
                {submitText}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default CreateBusinessAccount;
