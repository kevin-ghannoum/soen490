import * as React from 'react';
import { DataGrid, GridColDef, GridSelectionModel } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { getAllBusinessPays } from '../../services/LogHoursAPI';
import { PayStatus } from '../../dto/LogHours/PayDTOs';
import EditIcon from '@material-ui/icons/Edit';
import { useAppSelector } from '../../redux/hooks';
import { selectAccount } from '../../features/account/AccountSlice';

interface DataDisplay {
  id: number;
  employee: string;
  hoursWorked: number;
  hourlyWage: number;
  paidAmount: number;
  paidStatus: PayStatus;
  startDate: string;
  endDate: string;
}

const ViewProject: React.FC = () => {
  const [pays, setPays] = useState<DataDisplay[]>([]);
  const [selectedPays, setSelectedPays] = useState<DataDisplay[]>([]);
  const [totalHours, setTotalHours] = useState<number>(0);
  const [totalPay, setTotalPay] = useState<number>(0);

  const history = useHistory();

  const clickAddPay = () => {
    history.push(`/pay/new`);
  };

  const clickEditPay = (id: number) => {
    history.push(`/pay/edit/${id}`);
  };

  const updateSelection = (selectionModel: GridSelectionModel) => {
    const selected = pays.filter((pay) => selectionModel.indexOf(pay.id) > -1);
    setSelectedPays(selected);
  };

  useEffect(() => {
    var hoursSum = 0;
    var paySum = 0;
    selectedPays.forEach((pay) => {
      hoursSum += pay.hoursWorked;
      paySum += pay.paidAmount;
    });
    setTotalHours(hoursSum);
    setTotalPay(paySum);
  }, [selectedPays]);
  
  const account = useAppSelector(selectAccount);

  useEffect(() => {
    const fetchData = async () => {
      if (account.businessAcc) {
        const responsePays = await getAllBusinessPays(account.businessAcc?.businessId);
        const pays: DataDisplay[] = [];
        for (let element of responsePays.data) {
          const dataDisplay: DataDisplay = {
            id: element.id,
            employee: element.employeeAccount.account.username,
            hoursWorked: element.hoursWorked,
            hourlyWage: element.employeeAccount.hourlyWage,
            paidAmount: element.amount,
            paidStatus: element.status,
            startDate: element.periodStart,
            endDate: element.periodEnd,
          };
          pays.unshift(dataDisplay);
        }
        setPays(pays);
      }
    };
    fetchData();
  }, []);

  const columns: GridColDef[] = [
    {
      field: 'employee',
      headerName: 'Employee',
      width: 170,
      editable: false,
    },
    {
      field: 'hoursWorked',
      headerName: 'Hours worked',
      width: 170,
      editable: false,
    },
    {
      field: 'hourlyWage',
      headerName: 'Hourly wage',
      width: 170,
      editable: false,
    },
    {
      field: 'paidAmount',
      headerName: 'Paid amount',
      width: 170,
      editable: false,
    },
    {
      field: 'paidStatus',
      headerName: 'Paid status',
      width: 170,
      editable: false,
    },
    {
      field: 'startDate',
      headerName: 'Start date',
      width: 170,
      editable: false,
    },
    {
      field: 'endDate',
      headerName: 'End date',
      width: 170,
      editable: false,
    },
    {
      field: 'action',
      headerName: ' ',
      width: 50,
      editable: false,
      renderCell: (params: any) => {
        return <EditIcon onClick={() => clickEditPay(params.id)}></EditIcon>;
      },
    },
  ];

  return (
    <Grid
      id="View-Project-Grid"
      container
      spacing={0}
      direction="column"
      justifyContent="center"
      alignContent="center"
      style={{ minHeight: '100vh', paddingTop: '75px' }}
    >
      <div style={{ height: 650, width: '100%' }}>
        <Grid item xs={12}>
          <Grid container style={{ width: '75%', margin: 'auto' }}>
            <Button
              variant="contained"
              style={{ width: '150px', marginLeft: 'auto' }}
              color="primary"
              component="span"
              onClick={clickAddPay}
            >
              Add Pay
            </Button>
          </Grid>
          <Grid item xs={12} style={{ height: 560, width: '100%', marginBottom: 10, marginTop: 20 }}>
            {' '}
            <DataGrid
              style={{ maxWidth: '75%', margin: 'auto' }}
              rows={pays}
              columns={columns}
              pageSize={8}
              checkboxSelection={true}
              onSelectionModelChange={(selectionModel) => {
                updateSelection(selectionModel);
              }}
            />
          </Grid>

          <Grid item xs={12} style={{ textAlign: 'right' }}>
            <Grid style={{ maxWidth: '75%', margin: 'auto' }}>
              <Typography>Total hours worked: {totalHours}</Typography>
              <Typography>Total pay amount: {totalPay}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default ViewProject;
