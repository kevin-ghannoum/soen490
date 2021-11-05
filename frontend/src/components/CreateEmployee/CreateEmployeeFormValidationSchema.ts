import * as Yup from 'yup';

const createEmployeeSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  firstName: Yup.string().required('Required'),
  lastName: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  username: Yup.string().required('Required'),
  password: Yup.string().required('Required'),
  supervisorEmail: Yup.string().required('Required'),
  phone: Yup.string().required('Required'),
  civicNumber: Yup.number().nullable().required('Required').typeError('Civic number must be a number'),
  postalCode: Yup.string().required('Required'),
  streetName: Yup.string().required('Required'),
  cityName: Yup.string().required('Required'),
  province: Yup.string().required('Required'),
  country: Yup.string().required('Required'),
  title: Yup.string().required('Required'),
  hourlyWage: Yup.number().nullable().required('Required').typeError('Hourly wage must be a number'),
});

export default createEmployeeSchema;
