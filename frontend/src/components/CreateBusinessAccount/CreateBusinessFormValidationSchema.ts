import * as Yup from 'yup';

const createBusinessFormValidationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
  phone: Yup.string().required('Required'),
  civicNumber: Yup.number().nullable().required('Required'),
  postalCode: Yup.string().required('Required'),
  streetName: Yup.string().required('Required'),
  cityName: Yup.string().required('Required'),
  province: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  name: Yup.string().required('Required'),
  industry: Yup.string().required('Required'),
  website: Yup.string().optional(),
  socialMediaName: Yup.string().optional(),
  socialMediaLink: Yup.string().optional(),
});

export default createBusinessFormValidationSchema;
