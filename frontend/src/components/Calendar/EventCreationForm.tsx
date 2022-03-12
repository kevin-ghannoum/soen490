import { Button, Dialog, Grid, TextField, Typography } from '@material-ui/core';
import { FormikProps, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import createEventFormValidationSchema from './CreateEventFormValidationSchema';
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';
import { getAllRegexEmployeeAccount } from '../../services/AccountAPI';
import { createEvents } from '../../services/CalendarAPI';
export interface CreateEventData {
  title: string;
  start: string;
  end: string;
  location?: string;
  description: string;
  invitee: Array<string>;
}

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: any;
  onClose: () => void;
}

const EventCreationForm = (props: SimpleDialogProps) => {
  const [selectedDate, setSelectDate] = useState<string | undefined>(undefined);
  const [selectedStartTime, setSelectStartTime] = useState<string>('');
  const [selectedEndTime, setSelectEndTime] = useState<string>('');
  const [employeeList, setEmployeeList] = useState<Array<{ label: string }>>([]);
  const [disabled] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<any>([]);
  // Comment for future implementation of update
  // const [clientList, setClientList] = useState<any>([]);
  const [assigneeLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const { onClose, selectedValue, open } = props;
  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    if (selectedValue) {
      setSelectDate(convertDateToString(selectedValue.start));
      setSelectStartTime(convertDateToTime(selectedValue.start));
      setSelectEndTime(convertDateToTime(selectedValue.end));
    }
  }, [selectedValue]);

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
      if (selectedStartTime === '' || selectedEndTime === '') {
        setErrorMsg('Please fill all the required section');
      }

      if (formik.values.invitee.length === 0) {
        setErrorMsg('Please fill all the required section');
      }

      formik.values.start = `${selectedDate}T${selectedStartTime}`;
      formik.values.end = `${selectedDate}T${selectedEndTime}`;
      const temp: Array<string> = [];
      formik.values.invitee.forEach((invitee) => {
        const inviteeEmail = invitee as unknown as any;
        temp.push(inviteeEmail.email);
      });
      formik.values.invitee = temp;
      try {
        await createEvents(formik.values);
        handleClose();
      } catch (err) {
        setErrorMsg('Unexpected server error');
      }
    },
    validationSchema: createEventFormValidationSchema,
  });

  const handleDatePicker = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setSelectDate(event.target.value);
  };

  const handleTimePicker = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if (event.target.id === 'start-time') {
      setSelectStartTime(event.target.value);
    } else if (event.target.id === 'end-time') {
      setSelectEndTime(event.target.value);
    }
  };

  // Comment for future implementation for update
  // const getClientInput = async (event: React.ChangeEvent<{}>, value: string, reason: AutocompleteInputChangeReason) => {
  //   const clientResponse = await getAllClientAccount(value);
  //   const clients: any[] = [];
  //   clientResponse.data.forEach((element: any) => {
  //     clients.push(`${element.email}`);
  //   });
  //   setClientList([]);
  //   setClientList(clients);
  // };

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
    formik.setFieldValue('invitee', values);
  };

  const convertDateToString = (date: string) => {
    const dateString = new Date(date);
    const year = dateString.getFullYear();
    const monthValue = dateString.getMonth() + 1;
    let month = String(monthValue);
    if (monthValue < 10) {
      month = '0' + String(monthValue);
    }
    const dayValue = dateString.getDate();
    let day = String(dayValue);
    if (dayValue < 10) {
      day = '0' + String(dayValue);
    }
    return `${year}-${month}-${day}`;
  };

  const convertDateToTime = (date: string) => {
    const dateString = new Date(date);
    const hourValue = dateString.getHours();
    let hour = String(hourValue);
    if (hourValue < 10) {
      hour = '0' + String(hourValue);
    }
    const minuteValue = dateString.getMinutes();
    let minute = String(minuteValue);
    if (minuteValue < 10) {
      minute = '0' + String(minuteValue);
    }
    return `${hour}:${minute}`;
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth>
      {selectedValue ? (
        <form onSubmit={formik.handleSubmit}>
          <Grid container style={{ padding: '25px' }}>
            <Grid item xs={12}>
              <Typography variant="h4" color="primary">
                Create meeting
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Title*"
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
                  defaultValue={convertDateToString(selectedValue.start)}
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
                  defaultValue={convertDateToTime(selectedValue.start)}
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
                  defaultValue={convertDateToTime(selectedValue.end)}
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
                renderInput={(params) => <TextField {...params} variant="standard" size="small" label="Assignees*" />}
                disabled={disabled}
              />
            </Grid>
            {errorMsg && (
              <Grid xs={12}>
                <Typography style={{ color: 'red', marginTop: '10px' }}>{errorMsg}</Typography>
              </Grid>
            )}
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
      ) : (
        <></>
      )}
    </Dialog>
  );
};

export default EventCreationForm;
