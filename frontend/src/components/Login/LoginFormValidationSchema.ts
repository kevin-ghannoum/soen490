import * as Yup from 'yup';

const loginFormValidationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
});

export default loginFormValidationSchema;
