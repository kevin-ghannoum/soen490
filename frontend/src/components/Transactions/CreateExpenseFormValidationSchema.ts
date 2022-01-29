import * as Yup from 'yup';

const createExpenseFormValidationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  amount: Yup.number().required('Required').typeError('Amount must be a positive number').positive(),
  description: Yup.string().required('Required'),
  date: Yup.string().required('Required').typeError('Enter a date'),
  type: Yup.string().required('Required'),
});

export default createExpenseFormValidationSchema;
