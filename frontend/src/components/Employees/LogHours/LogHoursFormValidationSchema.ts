import * as Yup from 'yup';

const logHoursFormValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  startDate: Yup.string().when('automatic', {
    is: false,
    then: Yup.string().required('Required'),
  }),
  endDate: Yup.string().when('automatic', {
    is: false,
    then: Yup.string().required('Required'),
  }),
  hoursWorked: Yup.string().required('Required'),
  paidAmount: Yup.string().required('Required'),
});

export default logHoursFormValidationSchema;
