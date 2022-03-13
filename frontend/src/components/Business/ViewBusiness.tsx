import * as React from 'react';
import ViewBusinessStyle from './ViewBusinessStyle';
import { DataGrid, GridApi, GridCellValue, GridColDef, GridSelectionModel } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import { getAllClientAccount } from '../../services/AccountAPI';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import { createCall, getCalls, updateCall, deleteCall } from '../../services/CallAPI';
import { Autocomplete } from '@material-ui/lab';
import { CallCreationDTO, CallUpdateDTO } from '../../dto/CallLogs/CallLogDTOs';
import { useAppSelector } from '../../redux/hooks';
import { selectAccount } from '../../features/account/AccountSlice';
import { Edit, Delete } from '@material-ui/icons';
import { useHistory } from 'react-router';

interface Data {
  id: number;
  receiverName: string;
  date: string;
  phoneNumber: number;
  description: string;
  receiverEmail: string;
  action: string;
  followUp: boolean;
  neverCallBack: boolean;
  callerEmail: string;
}

interface TableData {
  id: number;
  name: string;
  username: string;
  email: string;
  businessName: string;
  industry: string;
  phoneNumber: number;
  address: string;
}

const actions = [
  'Called',
  'No Answer',
  'Left Voicemail',
  'Email sent',
  'Follow up',
  'Call Back',
  'Will call back',
  'Estimate booked',
];

const ViewBusiness: React.FC = () => {
  const history = useHistory();

  const [openDialog, setOpenDialog] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const [selectedClient, setSelectedClient] = React.useState<string | null>('');
  const [addedNote, setAddedNote] = React.useState<string | null>('');

  const [anchorElAction, setAnchorElAction] = React.useState<null | HTMLElement>(null);
  const [selectedIndexAction, setSelectedIndexAction] = React.useState(1);
  const openMenuAction = Boolean(anchorElAction);

  const [select, setSelection] = useState<GridSelectionModel>();

  const [selectID, setSelectionID] = useState<number>();

  const [clientList, setClientList] = useState<any>([]);

  const [callsDisplayed, setCallsDisplayed] = useState<any>([]);

  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  const [editState, setEditState] = React.useState(false);

  const account = useAppSelector(selectAccount);
  
  const handleClickAddBusiness = () => {
    history.push(`/businessAccount/new`);
  };

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSelectClient = (value: string | null) => {
    setSelectedClient(value);
  };

  const handleAddedNote = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddedNote(event?.target.value);
  };

  const handleClickListItemAction = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElAction(event.currentTarget);
  };

  const handleMenuItemClickAction = (event: React.MouseEvent<HTMLElement>, index: number) => {
    setSelectedIndexAction(index);
    setAnchorElAction(null);
  };

  const handleMenuCloseAction = () => {
    setAnchorElAction(null);
  };

  const handleRowSelection = (id: GridSelectionModel) => {
    setSelection(id);
  };

  const handleIDSelection = (id: number) => {
    setSelectionID(id);
  };

  const handleClickOpenDelete = () => {
    setOpenDeleteAlert(true);
  };

  const handleCloseDelete = () => {
    setOpenDeleteAlert(false);
  };

  const getClientInput = async (event: React.ChangeEvent<{}>, value: string) => {
    const clientResponse = await getAllClientAccount(value);
    const clients: any[] = [];
    clientResponse.data.forEach((element: any) => {
      clients.push(`${element.email}`);
    });
    setClientList(clients);
  };

  const clearStates = () => {
    setSelectedClient('');
    setAddedNote('');
    setSelectedIndexAction(1);
  };

  const handleSubmitLog = async () => {
    const data: CallCreationDTO = {
      receiverEmail: selectedClient as string,
      description: addedNote as string,
      action: actions[selectedIndexAction].toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      followUp: false,
      neverCallBack: false,
      callerEmail: account.account.email,
    };
    try {
      await createCall(data);
      setOpenDialog(false);
      clearStates();
      fetchData();
    } catch (err: any) {
      history.push('/error');
    }
  };

  const handleUpdatedLog = async () => {
    const data: CallUpdateDTO = {
      receiverEmail: selectedClient as string,
      description: addedNote as string,
      action: actions[selectedIndexAction].toUpperCase(),
      date: new Date().toISOString().split('T')[0],
      followUp: false,
      neverCallBack: false,
      callerEmail: account.account.email,
    };
    try {
      await updateCall(selectID as number, data);
      setOpenDialog(false);
      setEditState(false);
      clearStates();
      fetchData();
    } catch (err: any) {
      history.push('/error');
    }
  };

  const handleDeleteLog = async () => {
    try {
      await deleteCall(selectID as number);
      setOpenDeleteAlert(false);
      fetchData();
    } catch (err: any) {
      history.push('/error');
    }
  };

  const fetchData = async () => {
    const calls = await getCalls(account.account.email);
    const display: TableData[] = [];
    calls.data.forEach((element: Data) => {
      const dataDisplay: TableData = {
        id: element.id,
        name: 'fds',
        username: element.receiverName,
        email: element.receiverEmail,
        businessName: element.callerEmail,
        industry: element.description,
        phoneNumber: element.phoneNumber,
        address: element.callerEmail,
      };
      display.push(dataDisplay);
    });
    setCallsDisplayed(display);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [select]);

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      hide: true,
    },
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'username',
      headerName: 'Username',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'email',
      headerName: 'Email address',
      flex: 1,
      minWidth: 175,
    },
    {
      field: 'businessName',
      headerName: 'Business name',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'industry',
      headerName: 'Industry',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'phoneNumber',
      headerName: 'Phone',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'address',
      headerName: 'Address',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'edit',
      headerName: ' ',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: { stopPropagation: () => void }) => {
          e.stopPropagation(); // don't select this row after clicking
          setEditState(true);
          handleClickOpenDialog();

          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));

          setAddedNote(api.getCellValue(params.id, 'description') as string);

          setSelectedClient(api.getCellValue(params.id, 'receiverEmail') as string);

          setSelectedIndexAction(actions.indexOf(api.getCellValue(params.id, 'action') as string));

          return handleIDSelection(api.getCellValue(params.id, 'id') as number);
        };

        return (
          <Button onClick={onClick}>
            <Edit />
          </Button>
        );
      },
    },
    {
      field: 'delete',
      headerName: ' ',
      sortable: false,
      renderCell: (params) => {
        const onClick = (e: { stopPropagation: () => void }) => {
          e.stopPropagation(); // don't select this row after clicking

          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== '__check__' && !!c)
            .forEach((c) => (thisRow[c.field] = params.getValue(params.id, c.field)));

          handleClickOpenDelete();

          return handleIDSelection(api.getCellValue(params.id, 'id') as number);
        };

        return (
          <Button onClick={onClick}>
            <Delete />
          </Button>
        );
      },
    },
  ];

  const classes = ViewBusinessStyle();
  return (
    <Grid
      id="View-Logs-Grid"
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      alignContent="center"
      style={{ paddingTop: '75px' }}
    >
      <div style={{ height: 650, width: '100%' }}>
        <Grid item container spacing={3} direction="row" xs={12}>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              className={classes.addLogButton}
              color="primary"
              id="addLog"
              component="span"
              onClick={handleClickAddBusiness}
            >
              Add Business
            </Button>
            <Dialog fullScreen={fullScreen} open={openDialog} onClose={handleCloseDialog}>
              <Typography className={classes.dialogTitle}>{editState === false ? 'New Log' : 'Edit Log'}</Typography>
              <DialogContent className={classes.dialogContentMenus}>
                <Autocomplete
                  className={classes.selectBox}
                  id="selectClient"
                  loadingText="No Options"
                  options={clientList}
                  value={selectedClient}
                  onInputChange={getClientInput}
                  onChange={(event, value) => handleSelectClient(value)}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" style={{ alignContent: 'center' }} />
                  )}
                />
                <List component="nav" aria-label="Action">
                  <ListItem
                    button
                    id="lock-button"
                    aria-haspopup="listbox"
                    aria-controls="lock-menu"
                    aria-label="action"
                    aria-expanded={openMenuAction ? 'true' : undefined}
                    onClick={handleClickListItemAction}
                  >
                    <ListItemText primary="Action" secondary={actions[selectedIndexAction]} />
                  </ListItem>
                </List>
                <Menu
                  style={{ width: '100%' }}
                  id="lock-menu"
                  anchorEl={anchorElAction}
                  open={openMenuAction}
                  onClose={handleMenuCloseAction}
                  MenuListProps={{
                    'aria-labelledby': 'lock-button',
                    role: 'listbox',
                  }}
                >
                  {actions.map((option, index) => (
                    <MenuItem
                      key={option}
                      selected={index === selectedIndexAction}
                      onClick={(event) => handleMenuItemClickAction(event, index)}
                    >
                      {option}
                    </MenuItem>
                  ))}
                </Menu>
              </DialogContent>
              <DialogContent>
                <TextField
                  className={classes.dialogNote}
                  id="outlined-textarea"
                  label="Notes"
                  placeholder="Notes"
                  multiline
                  rows={4}
                  variant="outlined"
                  value={addedNote}
                  onChange={handleAddedNote}
                />
              </DialogContent>
              <DialogActions className={classes.dialogActionsButton}>
                {editState === false ? (
                  <Button id="createLog" size="small" variant="contained" color="primary" onClick={handleSubmitLog}>
                    Add
                  </Button>
                ) : (
                  <Button id="editLog" size="small" variant="contained" color="primary" onClick={handleUpdatedLog}>
                    Edit
                  </Button>
                )}
              </DialogActions>
            </Dialog>
            <Dialog
              open={openDeleteAlert}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{'Permanently delete business??'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  By clicking on "Agree", you will be permanently deleting this business. If you wish to go back to the
                  previous page, simply click on "Disagree".
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDelete}>Disagree</Button>
                <Button size="small" variant="contained" color="primary" onClick={handleDeleteLog} autoFocus>
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={12} style={{ height: 560, width: '100%' }}>
            {' '}
            <DataGrid
              style={{ maxWidth: '75%', margin: 'auto' }}
              rows={callsDisplayed}
              columns={columns}
              pageSize={10}
              onSelectionModelChange={handleRowSelection}
            />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default ViewBusiness;
