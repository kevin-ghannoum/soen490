import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { createProduction, getProduction, updateProduction } from '../../services/TransactionAPI';
import { FormikProps, useFormik } from 'formik';
import { useHistory } from 'react-router';
import { ProjectDisplay } from '../../dto/ProjectDTOs';
import { getProject } from '../../services/ProjectAPI';
import createProductionFormValidationSchema from './CreateProductionFormValidationSchema';
import { ProductionDataRetrievalFormatDTO } from '../../dto/TransactionDTOs';

interface Props {
  id: string;
  operation: string;
  productionEditId: string;
}

interface CreateProductionData {
  description: string;
  date: string;
  amount: number | string;
  paymentType: string;
}

const CreateProduction: React.FC<Props> = ({ id, operation, productionEditId }) => {
  const [validDate, setValidDate] = useState<boolean>(true);
  const [projectCreatedDate, setProjectCreatedDate] = useState<string>('');
  const history = useHistory();

  const formik: FormikProps<CreateProductionData> = useFormik<CreateProductionData>({
    initialValues: {
      description: '',
      date: '',
      amount: '',
      paymentType: '',
    },
    onSubmit: async (values) => {
      try {
        if (operation === 'create') {
          if ((await validateDates(values)) === true) {
            await createProduction({
              transaction: {
                amount: values.amount,
                description: values.description,
                date: values.date,
                projectId: id,
              },
              production: {
                id: '0',
              },
              paymentType: values.paymentType,
            });
            history.go(0);
          } else {
            setValidDate(false);
          }
        }
        if (operation === 'edit') {
          if ((await validateDates(values)) === true) {
            await updateProduction({
              id: Number(productionEditId),
              transaction: {
                amount: values.amount,
                description: values.description,
                date: values.date,
              },
              invoice: {
                totalAmount: values.amount,
                description: values.description,
                date: values.date,
                paymentType: values.paymentType,
              },
            });
            history.go(0);
          } else {
            setValidDate(false);
          }
        }
      } catch (err: any) {
        if (err.response.data.status === 500) {
          setErrMessage('Unexpected error');
        } else if (err.response.data.message) {
          setErrMessage(err.response.data.message);
        }
      }
    },
    validationSchema: createProductionFormValidationSchema,
  });

  useEffect(() => {
    const fetchProduction = async () => {
      if (operation === 'edit') {
        const data = await getProduction(productionEditId);
        const productionInfo: ProductionDataRetrievalFormatDTO = data.data;
        const formattedDate = productionInfo.transaction.date.split('T')[0];
        formik.setFieldValue('description', productionInfo.transaction.description);
        formik.setFieldValue('date', formattedDate);
        formik.setFieldValue('amount', productionInfo.transaction.amount);
        formik.setFieldValue('paymentType', productionInfo.invoice.paymentType);
      }
    };
    fetchProduction();
    // eslint-disable-next-line
  }, [id]);

  useEffect(() => {
    const getProjectInfo = async () => {
      if (id) {
        try {
          const data = await getProject(id);
          const info: ProjectDisplay = data.data[0];
          const createdDate = info.createdDate.split('T')[0];
          setProjectCreatedDate(createdDate);
        } catch (e) {}
      }
    };
    getProjectInfo();
  }, [id]);

  const validateDates = async (values: CreateProductionData) => {
    try {
      if (projectCreatedDate !== null || projectCreatedDate !== undefined) {
        if (projectCreatedDate < values.date) {
          return true;
        } else {
          return false;
        }
      }
    } catch (e) {
      setValidDate(false);
    }
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
        {operation === 'edit' ? (
          <Typography style={{ fontWeight: 'bold', marginBottom: 10 }}> Edit Production</Typography>
        ) : (
          <Typography style={{ fontWeight: 'bold', marginBottom: 10 }}> New Production</Typography>
        )}
        <TextField
          id="description"
          label="Description"
          name="description"
          variant="outlined"
          multiline
          rows={3}
          onChange={formik.handleChange}
          value={formik.values.description}
          error={formik.touched.description && Boolean(formik.errors.description)}
          helperText={formik.touched.description && formik.errors.description}
          style={{ marginBottom: 20, width: '100%' }}
        ></TextField>
        <TextField
          fullWidth
          id="productionDate"
          label="Production Date"
          type="date"
          name="date"
          InputLabelProps={{
            shrink: true,
          }}
          onChange={formik.handleChange}
          value={formik.values.date}
          error={formik.touched.date && Boolean(formik.errors.date)}
          helperText={formik.touched.date && formik.errors.date}
        />
        {!validDate && <Typography style={{ color: 'red' }}>Date must be after the project creation date</Typography>}
        <TextField
        id="totalAmount"
          label="Amount"
          name="amount"
          fullWidth
          onChange={formik.handleChange}
          value={formik.values.amount}
          error={formik.touched.amount && Boolean(formik.errors.amount)}
          helperText={formik.touched.amount && formik.errors.amount}
        />
        <Box style={{ display: 'flex', width: 'max' }}>
          <InputLabel id="type-label" style={{ marginTop: 20 }}>
            Payment Type
          </InputLabel>
          <Select
            label="Payment Type"
            labelId="type-label"
            id="selectType"
            name="paymentType"
            style={{ width: 160, marginLeft: 10, marginTop: 12 }}
            onChange={formik.handleChange}
            value={formik.values.paymentType}
            error={formik.touched.paymentType && Boolean(formik.errors.paymentType)}
          >
            <MenuItem id="progress" value={'PROGRESS'}>
              Progress
            </MenuItem>
            <MenuItem id="final_payment" value={'FINAL PAYMENT'}>
              Final Payment
            </MenuItem>
            <MenuItem id="deposit" value={'DEPOSIT'}>
              Deposit
            </MenuItem>
          </Select>
        </Box>
        {operation === 'edit' ? (
          <Button color="primary" variant="contained" id="save_Production" type="submit" style={{ marginTop: 20 }}>
            Save
          </Button>
        ) : (
          <Button color="primary" variant="contained" id="create_Production" type="submit" style={{ marginTop: 20 }}>
            Create
          </Button>
        )}
      </Grid>
    </form>
  );
};

export default CreateProduction;
function setErrMessage(arg0: string) {
  throw new Error('Function not implemented.');
}
