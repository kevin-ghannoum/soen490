import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core';
import { FormikProps, useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import createEventFormValidationSchema from './CreateEventFormValidationSchema';
import Autocomplete, { AutocompleteInputChangeReason } from '@material-ui/lab/Autocomplete';
import { getAllRegexEmployeeAccount } from '../../services/AccountAPI';
import { createEvents, deleteEvent, updateEvents } from '../../services/EventAPI';
export interface CreateEventData {
  id?: number;
  title: string;
  start: string;
  end: string;
  location?: string;
  description: string;
  invitee: Array<string>;
}

export interface EventUpdateDTO {
  id?: number;
  title: string;
  start: string;
  end: string;
  location?: string;
  description?: string;
  invitee: Array<string>;
  createdBy: string;
}

export interface SimpleDialogProps {
  open: boolean;
  selectedValue: any;
  onClose: () => void;
  update: boolean;
}

const EventCreationForm = (props: SimpleDialogProps) => {
  const [selectedDate, setSelectDate] = useState<string | undefined>(undefined);
  const [selectedStartTime, setSelectStartTime] = useState<string>('');
  const [selectedEndTime, setSelectEndTime] = useState<string>('');
  const [employeeList, setEmployeeList] = useState<Array<{ label: string }>>([]);
  const [disabled] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<any>([]);
  const [assigneeLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [openDeleteAlert, setOpenDelteAlert] = useState(false);
  const { onClose, selectedValue, open, update } = props;
  const handleClose = () => {
    onClose();
  };

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
      try {
        if (update) {
          const temp: Array<any> = [];
          assignee.forEach((account: any) => {
            temp.push({ status: 'PENDING', email: account.email, id: selectedValue.id });
          });
          formik.values.invitee = temp;
          formik.values.id = selectedValue.id;
          const dataToSubmit = { ...formik.values, createdBy: selectedValue.createdBy };
          await updateEvents(dataToSubmit as unknown as EventUpdateDTO);
        } else {
          const temp: Array<string> = [];
          formik.values.invitee.forEach((invitee) => {
            const inviteeEmail = invitee as unknown as any;
            temp.push(inviteeEmail.email);
          });
          formik.values.invitee = temp;
          await createEvents(formik.values);
        }
        handleClose();
      } catch (err) {
        setErrorMsg('Unexpected server error');
      }
    },
    validationSchema: createEventFormValidationSchema,
  });

  useEffect(() => {
    if (selectedValue) {
      setSelectDate(convertDateToString(selectedValue.start));
      setSelectStartTime(convertDateToTime(selectedValue.start));
      setSelectEndTime(convertDateToTime(selectedValue.end));
      setAssignee([]);
      formik.values.title = '';
      formik.values.location = '';
      formik.values.invitee = [];
      formik.values.description = '';
      if (selectedValue.title) {
        formik.values.title = selectedValue.title;
      }
      if (selectedValue.location) {
        formik.values.location = selectedValue.location;
      }
      if (selectedValue.description) {
        formik.values.description = selectedValue.description;
      }
      if (selectedValue.accounts) {
        const temp: Array<any> = [];
        selectedValue.accounts.forEach((account: any) => {
          temp.push({
            email: account.Invited.email,
            label: `${account.firstName} ${account.lastName} (${account.Invited.status})`,
          });
        });
        setAssignee(temp);
      }
    }
    // eslint-disable-next-line
  }, [selectedValue]);

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

  const handleDeleteEvent = async () => {
    try {
      await deleteEvent(selectedValue.id);
      handleClose();
    } catch (error) {
      setErrorMsg('Unexpected error when deleting');
    }
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

  const handleClickOpenDelete = () => {
    setOpenDelteAlert(true);
  };

  const handleCloseDelete = () => {
    setOpenDelteAlert(false);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open} fullWidth>
      {selectedValue && (
        <form onSubmit={formik.handleSubmit}>
          <Grid container style={{ padding: '25px' }}>
            <Grid item xs={12}>
              <Typography variant="h4" color="primary" style={{ marginBottom: '10px' }}>
                {!update ? 'Create meeting' : 'Update Meeting'}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Title*"
                name="title"
                fullWidth
                style={{ marginTop: '15x' }}
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
                  label="Date*"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={convertDateToString(selectedValue.start)}
                  onChange={handleDatePicker}
                  style={{ margin: '10px', marginLeft: '0px' }}
                />
                <TextField
                  id="start-time"
                  label="Start*"
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={selectedStartTime}
                  style={{ margin: '10px' }}
                  onChange={(e) => handleTimePicker(e)}
                />
                <TextField
                  id="end-time"
                  label="End*"
                  type="time"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  value={selectedEndTime}
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
                style={{ marginTop: '3px' }}
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
                style={{ marginTop: '10px' }}
                onChange={formik.handleChange}
                value={formik.values.description}
                error={formik.touched.description && Boolean(formik.errors.description)}
                helperText={formik.touched.description && formik.errors.description}
              />
            </Grid>
            <Grid item xs={12} style={{ marginTop: 10 }}>
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

            <Dialog
              open={openDeleteAlert}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">Delete this event?</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  By clicking "Agree", you will be permanently deleting this event.
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDelete}>Disagree</Button>
                <Button size="small" variant="contained" color="primary" onClick={handleDeleteEvent} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
            <Grid xs={12}>
              {!update ? (
                <Button
                  style={{ margin: '15px', marginLeft: '0px', float: 'left' }}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  Create
                </Button>
              ) : (
                <>
                  <Button
                    style={{ margin: '15px', marginLeft: '0px', float: 'left' }}
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Update
                  </Button>
                  <Button
                    style={{ margin: '15px', marginLeft: '0px', float: 'left', background: 'red', color: 'white' }}
                    variant="contained"
                    onClick={handleClickOpenDelete}
                  >
                    Delete
                  </Button>
                </>
              )}
            </Grid>
          </Grid>
        </form>
      )}
    </Dialog>
  );
};

export default EventCreationForm;
