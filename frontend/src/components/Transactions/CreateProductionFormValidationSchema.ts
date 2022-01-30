import * as Yup from 'yup';

const createProductionFormValidationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  amount: Yup.number().required('Required').typeError('Amount must be a positive number').positive(),
  description: Yup.string().required('Required'),
  date: Yup.string().required('Required').typeError('Enter a date'),
  quantity: Yup.number().required('Required').typeError('Quantity must be a positive number').positive(),
});

export default createProductionFormValidationSchema;
