import { Grid, Link, Typography } from '@material-ui/core';
import { DataGrid, GridColDef, GridSelectionModel } from '@material-ui/data-grid';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { getBookedBusinessProject } from '../../services/ProjectAPI';

interface Sale {
  amount: number;
}

interface Data {
  id: number;
  title: string;
  email: string;
  description: string;
  status: string;
  serviceType: string;
  createdDate: string;
  followUpDate: string;
  deadlineDate: string;
  leadSource: string;
  leadRanking: string;
  leadCredit: string;
  sale: Sale;
}
interface DataDisplay {
  id: number;
  title: string | any;
  email: string;
  description: string;
  status: string;
  service: string;
  createdDate: string;
  followUpDate: string;
  deadlineDate: string;
  leadSource: string;
  leadRanking: string;
  leadCredit: string;
  sale: number;
}

const BookedProjects: React.FC = () => {
  const [bookedProjectList, setBookedProjectList] = useState<any>([]);

  const [select, setSelection] = useState<GridSelectionModel>();
  const handleRowSelection = (id: GridSelectionModel) => {
    setSelection(id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const projects = await getBookedBusinessProject(1);
      const projectList: DataDisplay[] = [];
      projects.data.forEach((element: Data) => {
        const createdDate = element.createdDate.split('T');
        const followUpDate = element.followUpDate.split('T');
        const deadlineDate = element.deadlineDate.split('T');
        const dataDisplay: DataDisplay = {
          id: element.id,
          title: { id: element.id, title: element.title },
          email: element.email,
          description: element.description,
          status: element.status.charAt(0) + element.status.substring(1).toLowerCase(),
          service: element.serviceType,
          createdDate: createdDate[0],
          followUpDate: followUpDate[0],
          deadlineDate: deadlineDate[0],
          leadSource: element.leadSource,
          leadCredit: element.leadCredit,
          leadRanking: element.leadRanking,
          sale: element.sale.amount,
        };
        projectList.unshift(dataDisplay);
      });
      setBookedProjectList(projectList);
    };
    fetchData();
  }, [select]);

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
      editable: false,
      renderCell: (params: any) => {
        return <Link href={`/project_transaction/${params.value.id}`}>{params.value.title}</Link>;
      },
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 150,
      editable: false,
    },
    {
      field: 'email',
      headerName: 'Client',
      width: 150,
      editable: false,
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 150,
      editable: false,
    },
    {
      field: 'service',
      headerName: 'Service',
      width: 150,
      editable: false,
    },
    {
      field: 'sale',
      headerName: 'Sale Value ($)',
      type: 'number',
      width: 170,
      editable: false,
    },
    {
      field: 'createdDate',
      headerName: 'Created Date',
      width: 170,
      editable: false,
    },
    {
      field: 'followUpDate',
      headerName: 'Follow Up Date',
      width: 200,
      editable: false,
    },
    {
      field: 'deadlineDate',
      headerName: 'Project Deadline',
      width: 200,
      editable: false,
    },
    {
      field: 'leadSource',
      headerName: 'Lead Source',
      width: 200,
      editable: false,
    },
    {
      field: 'leadCredit',
      headerName: 'Lead Credit',
      width: 170,
      editable: false,
    },
    {
      field: 'leadRanking',
      headerName: 'LeadRanking',
      width: 170,
      editable: false,
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
        <Grid item container spacing={3} direction="row" xs={12}>
          <Grid item xs={4}>
            <Typography variant="h5" style={{ marginLeft: '1%', width: '100%', fontWeight: 'bold' }}>
              Manage Transactions
            </Typography>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={12} style={{ height: 560, width: '100%' }}>
            <DataGrid
              style={{ maxWidth: '80%', margin: 'auto' }}
              rows={bookedProjectList}
              columns={columns}
              pageSize={8}
              onSelectionModelChange={handleRowSelection}
            />
          </Grid>
        </Grid>
      </div>
    </Grid>
  );
};

export default BookedProjects;
