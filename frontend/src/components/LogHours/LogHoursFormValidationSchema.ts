import * as Yup from 'yup';

const logHoursSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  startDate: Yup.string().required('Required'),
  endDate: Yup.string().required('Required'),
  hoursWorked: Yup.string().required('Required'),
  paidAmount: Yup.string().required('Required'),
});

export default logHoursSchema;