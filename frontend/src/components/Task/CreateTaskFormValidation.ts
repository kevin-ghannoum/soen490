import * as Yup from 'yup';

const today = new Date();
today.setHours(0, 0, 0, 0);

const createTaskFromSchema: Yup.ObjectSchema<any> = Yup.object().shape({
  title: Yup.string().required('Required'),
  deadlineDate: Yup.date().required('Required').min(today, 'Date cannot be in the past').nullable(),
  // Database does not allow creation of tasks without a project
  projectId: Yup.string().required('Required'),
});

export default createTaskFromSchema;
