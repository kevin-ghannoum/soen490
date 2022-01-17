import * as Yup from 'yup';

const createProjectFormValidationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  title: Yup.string().required('Required'),
  description: Yup.string().optional(),
  status: Yup.string().required('Required'),
  serviceType: Yup.string().optional(),
  leadSource: Yup.string().optional(),
  leadCredit: Yup.string().nullable().optional(),
  leadRanking: Yup.string().optional(),
  followUpDate: Yup.string().nullable().required('Required').typeError('Enter a date'),
  deadLineDate: Yup.string().nullable().optional(),
  extraNotes: Yup.string().optional(),
  email: Yup.string().required('Required').typeError('Select a client'),
  saleDescription: Yup.string().required('Required'),
  saleValue: Yup.number().nullable().required('Required').typeError('Enter a number'),
  assignees: Yup.array().nullable().optional(),
});

export default createProjectFormValidationSchema;
