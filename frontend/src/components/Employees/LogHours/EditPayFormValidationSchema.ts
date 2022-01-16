import * as Yup from 'yup';

const editPaySchema = Yup.object().shape({
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

export default editPaySchema;
