import * as Yup from 'yup';
const createEventFormValidationSchema: Yup.ObjectSchema<any> = Yup.object().shape({
    title:Yup.string().required('Required'),
    location:Yup.string().optional(),
    description:Yup.string().optional(),
})
export default createEventFormValidationSchema;