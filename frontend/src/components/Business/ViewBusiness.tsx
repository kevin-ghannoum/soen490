import * as React from 'react';
import ViewBusinessStyle from './ViewBusinessStyle';
import { DataGrid, GridApi, GridCellValue, GridColDef } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@material-ui/core';
import { getAllBusinesses, deleteBusiness } from '../../services/BusinessAPI';
import { Edit, Delete } from '@material-ui/icons';
import { useHistory } from 'react-router';

interface Data {
  id: number;
  name: string;
  industry: string;
  website: number;
  email: string;
  businessAccount: {
    email: string;
    account: {
      firstName: string;
      lastName: string;
      phoneNumber: string;
      username: string;
      address: {
        id: number;
        civicNumber: number;
        streetName: string;
        postalCode: string;
        cityName: string;
        province: string;
        country: string;
      };
    };
  };
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
  phoneNumber: string;
  address: string;
}

const ViewBusiness: React.FC = () => {
  const history = useHistory();

  const [selectID, setSelectionID] = useState<number>();

  const [callsDisplayed, setCallsDisplayed] = useState<any>([]);

  const [openDeleteAlert, setOpenDeleteAlert] = React.useState(false);

  const handleClickAddBusiness = () => {
    history.push(`/businessAccount/new`);
  };

  const handleEditClick = (id: number) => {
    history.push(`/business/edit/${id}`);
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

  const handleDeleteBusiness = async () => {
    try {
      if (selectID) {
        await deleteBusiness(selectID);
        setOpenDeleteAlert(false);
        fetchData();
      } else {
        throw Error;
      }
    } catch (err: any) {
      history.push('/error');
    }
  };

  const fetchData = async () => {
    const calls = await getAllBusinesses();
    const display: TableData[] = [];
    calls.data.forEach((element: Data) => {
      const dataDisplay: TableData = {
        id: element.id,
        name: element.name,
        username: element.businessAccount.account.username,
        email: element.email,
        businessName: element.name,
        industry: element.industry,
        phoneNumber: element.businessAccount.account.phoneNumber,
        address:
          element.businessAccount.account.address.civicNumber +
          ' ' +
          element.businessAccount.account.address.streetName,
      };
      display.push(dataDisplay);
    });
    setCallsDisplayed(display);
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

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
      minWidth: 300,
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
      renderCell: (params: any) => {
        return <Edit onClick={() => handleEditClick(params.id)}></Edit>;
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
      id="View-Business-Grid"
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      alignContent="center"
      style={{ minHeight: '100vh', paddingTop: '75px' }}
    >
      <div style={{ height: 650, width: '100%' }}>
        <Grid item direction="row" xs={12}>
          <Grid container style={{ width: '75%', margin: 'auto' }}>
            <Button
              variant="contained"
              className={classes.addBusinessButton}
              style={{ width: '150px', marginLeft: 'auto' }}
              color="primary"
              id="addBusinessButton"
              component="span"
              onClick={handleClickAddBusiness}
            >
              Add Business
            </Button>
            <Dialog
              open={openDeleteAlert}
              onClose={handleCloseDelete}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{'Permanently delete business?'}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  By clicking on "Agree", you will be permanently deleting this business. If you wish to go back to the
                  previous page, simply click on "Disagree".
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button id="deleteNo" onClick={handleCloseDelete}>
                  Disagree
                </Button>
                <Button
                  id="deleteYes"
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleDeleteBusiness}
                  autoFocus
                >
                  Agree
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
          <Grid item xs={12} style={{ height: 560, width: '100%', marginBottom: 10, marginTop: 20 }}>
            {' '}
            <DataGrid
              style={{ maxWidth: '75%', margin: 'auto' }}
              rows={callsDisplayed}
              columns={columns}
              pageSize={10}
            />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default ViewBusiness;
