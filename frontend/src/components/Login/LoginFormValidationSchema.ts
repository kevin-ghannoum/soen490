import * as Yup from 'yup';

const loginSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  email: Yup.string().email('Invalid email format').required('Required'),
  password: Yup.string().required('Required'),
});

export default loginSchema;
