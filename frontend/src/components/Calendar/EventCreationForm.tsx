import { Button, Dialog, Grid, TextField, Typography} from '@material-ui/core';
import { FormikProps, useFormik } from 'formik';
import React, { useState } from 'react';
import createEventFormValidationSchema from './CreateEventFormValidationSchema';
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';
import { getAllClientAccount, getAllRegexEmployeeAccount } from '../../services/AccountAPI';

interface CreateEventData {
  title: string;
  start: string;
  end: string;
  location?: string;
  description: string;
  invitee: Array<string>;
}

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const EventCreationForm = () => {
  
  const [selectedDate, setSelectDate] = useState<string | undefined>(undefined);
  const [selectedStartTime, setSelectStartTime] = useState<string>('');
  const [selectedEndTime, setSelectEndTime] = useState<string>('');
  const [employeeList, setEmployeeList] = useState<Array<{ label: string }>>([]);
  const [disabled, setDisabled] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<any>([]);
  const [clientList, setClientList] = useState<any>([]);
  const [assigneeLoading, setAssigeeLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // const { onClose, selectedValue, open } = props;

  // const handleClose = () => {
  //   onClose(selectedValue);
  // };


  const formik: FormikProps<CreateEventData> = useFormik<CreateEventData>({
    initialValues: {
      title: '',
      start: '',
      end: '',
      location: '',
      description: '',
      invitee: [],
    },
    onSubmit: async (values) => {
      if (formik.values.start === '' || formik.values.end === '') {
        setErrorMsg('Please fill all the required section');
      }

      formik.values.start = `${selectedDate}T${selectedStartTime}`;
      formik.values.end = `${selectedDate}T${selectedStartTime}`;
    },
    // validationSchema: createEventFormValidationSchema,
  });

  const handleDatePicker = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSelectDate(event.target.value);
  };

  const handleTimePicker = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.target.id === 'start-time') {
      console.log(event.target.value);
      setSelectStartTime(event.target.value);
    } else if (event.target.id === 'end-time') {
      console.log(event.target.value);
      setSelectEndTime(event.target.value);
    }
  };

  const getClientInput = async (event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
    const clientResponse = await getAllClientAccount(value);
    const clients: any[] = [];
    clientResponse.data.forEach((element: any) => {
      clients.push(`${element.email}`);
    });
    setClientList([]);
    setClientList(clients);
  };

  const getEmployeeInput = async (
    event: React.ChangeEvent<{}>,
    value: string,
    reason: AutocompleteInputChangeReason
  ) => {
    const employeeResponse = await getAllRegexEmployeeAccount(value);
    const assignees: any[] = [];
    employeeResponse.data.forEach((element: any) => {
      assignees.push({ label: `${element.account.username}`, email: `${element.account.email}` });
    });
    setEmployeeList([]);
    setEmployeeList(assignees);
  };

  const onAssigneeTagsChange = async (event: React.ChangeEvent<{}>, values: Object[]) => {
    values = values.filter(
      (elem: any, index, self) =>
        self.findIndex((t: any) => {
          return t.label === elem.label;
        }) === index
    );
    setAssignee(values);
    formik.setFieldValue('assignee', values);
  };
  

  return (
    // <Dialog>
      <form onSubmit={formik.handleSubmit}>
        <Grid
          container
          style={{ width: '25%', border: 'solid 3px #2BB1E4', borderRadius: '15px', padding: '25px' }}
          spacing={1}
        >
          <Grid item xs={12}>
            <Typography variant="h4" color="primary">
              Create meeting
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Title"
              name="title"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.title}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid>
          <Grid item xs={12}>
            <div style={{ float: 'left' }}>
              <TextField
                id="date"
                label="Date"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleDatePicker}
                style={{ margin: '10px', marginLeft: '0px' }}
              />
              <TextField
                id="start-time"
                label="Start"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ margin: '10px' }}
                onChange={(e) => handleTimePicker(e)}
              />
              <TextField
                id="end-time"
                label="End"
                type="time"
                InputLabelProps={{
                  shrink: true,
                }}
                style={{ margin: '10px' }}
                onChange={(e) => handleTimePicker(e)}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Location"
              name="location"
              fullWidth
              onChange={formik.handleChange}
              value={formik.values.location}
              error={formik.touched.location && Boolean(formik.errors.location)}
              helperText={formik.touched.location && formik.errors.location}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              name="description"
              onChange={formik.handleChange}
              value={formik.values.description}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
            />
          </Grid>
          <Grid item xs={12} style={{ marginTop: 5 }}>
            <Autocomplete
              loading={assigneeLoading}
              onInputChange={getEmployeeInput}
              loadingText="No Options"
              noOptionsText="No Options found"
              style={{ width: '100%' }}
              value={assignee}
              onChange={onAssigneeTagsChange}
              ListboxProps={{ style: { maxHeight: '10rem' }, position: 'bottom-start' }}
              multiple
              id="selectEmployee"
              options={employeeList}
              getOptionLabel={(option) => option.label}
              filterSelectedOptions
              renderInput={(params) => <TextField {...params} variant="standard" size="small" label="Assignees" />}
              disabled={disabled}
            />
          </Grid>
          <Grid xs={12}>
            <Button
              style={{ margin: '15px', marginLeft: '0px', float: 'left' }}
              type="submit"
              variant="contained"
              color="primary"
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </form>
    // </Dialog>
  );
};

export default EventCreationForm;
