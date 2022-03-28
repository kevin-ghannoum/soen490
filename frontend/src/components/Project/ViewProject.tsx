import * as React from 'react';
import { DataGrid, GridColDef, GridSelectionModel } from '@material-ui/data-grid';
import { useEffect, useState } from 'react';
import { getAllBusinessProject } from '../../services/ProjectAPI';
import { Button, Grid, Link } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import { selectAccount } from '../../features/account/AccountSlice';
import { useAppSelector } from '../../redux/hooks';

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

const ViewProject: React.FC = () => {
  const [projectList, setProjectList] = useState<any>([]);
  const [archivedProject, setArchivedProject] = useState<any>([]);
  const [nonArchivedProject, setNonArchivedProject] = useState<any>([]);
  const history = useHistory();
  const [archived, setArchived] = useState<boolean>(false);

  const account = useAppSelector(selectAccount);

  const [select, setSelection] = useState<GridSelectionModel>();
  const handleRowSelection = (id: GridSelectionModel) => {
    setSelection(id);
  };

  const clickAddProject = () => {
    history.push('/project');
  };

  const handleToggle = async () => {
    setArchived(!archived);
  };

  useEffect(() => {
    if (archived === true) {
      setProjectList(archivedProject);
    } else {
      setProjectList(nonArchivedProject);
    }
  }, [archived, archivedProject, nonArchivedProject]);

  useEffect(() => {
    const fetchData = async () => {
      let projects;
      if (account.businessAcc) {
        projects = await getAllBusinessProject(account.businessAcc?.businessId);
      } else {
        projects = await getAllBusinessProject(1);
      }
      const noArchived: DataDisplay[] = [];
      const archivedProjectList: DataDisplay[] = [];
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
        if (element.status === 'COMPLETED') {
          archivedProjectList.unshift(dataDisplay);
        } else {
          noArchived.unshift(dataDisplay);
        }
      });
      setNonArchivedProject(noArchived);
      setArchivedProject(archivedProjectList);
    };
    fetchData();
    // eslint-disable-next-line
  }, [select]);

  const columns: GridColDef[] = [
    {
      field: 'title',
      headerName: 'Title',
      width: 150,
      editable: false,
      renderCell: (params: any) => {
        return <Link href={`/project/${params.value.id}?edit=false`}>{params.value.title}</Link>;
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
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <Button
              variant="contained"
              style={{ width: '150px', marginBottom: 10, marginRight: 5, alignItems: 'right' }}
              color="primary"
              component="span"
              onClick={clickAddProject}
            >
              Add Project
            </Button>
          </Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}></Grid>
          <Grid item xs={4}>
            <FormControl component="fieldset">
              <FormGroup aria-label="position" row>
                <FormControlLabel
                  value="archived"
                  labelPlacement="start"
                  control={<Switch color="primary" />}
                  style={{ minWidth: '150px', marginBottom: 10, marginRight: 70, alignItems: 'right' }}
                  label="View Archived Projects"
                  onClick={() => handleToggle()}
                />
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12} style={{ height: 560, width: '100%' }}>
            {' '}
            <DataGrid
              style={{ maxWidth: '75%', margin: 'auto' }}
              rows={projectList}
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

export default ViewProject;
