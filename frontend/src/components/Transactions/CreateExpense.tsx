import { Box, Button, Grid, InputLabel, MenuItem, Select, TextField, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { createExpense, getExpense, updateExpense } from '../../services/TransactionAPI';
import { FormikProps, useFormik } from 'formik';
import createExpenseFormValidationSchema from './CreateExpenseFormValidationSchema';
import { useHistory } from 'react-router';
import { ProjectDisplay } from '../../dto/ProjectDTOs';
import { getProject } from '../../services/ProjectAPI';
import { ExpenseDataRetrievalFormatDTO } from '../../dto/TransactionDTOs';

interface Props {
  id: string;
  operation: string;
  expenseEditId: string;
}

interface CreateExpenseData {
  description: string;
  date: string;
  amount: number | string;
  type: string;
}

const CreateExpense: React.FC<Props> = ({ id, operation, expenseEditId }) => {
  const [validDate, setValidDate] = useState<boolean>(true);
  const [projectCreatedDate, setProjectCreatedDate] = useState<string>('');
  const history = useHistory();

  const formik: FormikProps<CreateExpenseData> = useFormik<CreateExpenseData>({
    initialValues: {
      description: '',
      date: '',
      amount: '',
      type: 'WAGES',
    },
    onSubmit: async (values) => {
      try {
        if (operation === 'create') {
          if ((await validateDates(values)) === true) {
            await createExpense({
              transaction: {
                amount: values.amount,
                description: values.description,
                date: values.date,
                projectId: id,
              },
              expense: {
                type: values.type,
              },
            });
            history.go(0);
          } else {
            setValidDate(false);
          }
        }
        if (operation === 'edit') {
          if ((await validateDates(values)) === true) {
            await updateExpense({
              id: Number(expenseEditId),
              transaction: {
                amount: values.amount,
                description: values.description,
                date: values.date,
              },
              expense: {
                type: values.type,
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
    validationSchema: createExpenseFormValidationSchema,
  });

  useEffect(() => {
    const fetchExpense = async () => {
      if (operation === 'edit') {
        const data = await getExpense(expenseEditId);
        const expenseInfo: ExpenseDataRetrievalFormatDTO = data.data;
        const formattedDate = expenseInfo.transaction.date.split('T')[0];
        formik.setFieldValue('description', expenseInfo.transaction.description);
        formik.setFieldValue('date', formattedDate);
        formik.setFieldValue('amount', expenseInfo.transaction.amount);
        formik.setFieldValue('type', expenseInfo.type);
      }
    };
    fetchExpense();
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

  const validateDates = async (values: CreateExpenseData) => {
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
          <Typography style={{ fontWeight: 'bold', marginBottom: 10 }}> Edit Expense</Typography>
        ) : (
          <Typography style={{ fontWeight: 'bold', marginBottom: 10 }}> New Expense</Typography>
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
          style={{ marginBottom: 20 }}
        ></TextField>
        <TextField
          fullWidth
          id="expenseDate"
          label="Expense Date"
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
        {!validDate && (
          <Typography variant="subtitle1" style={{ color: 'red', fontSize: 11 }}>
            Date must be after the project creation date
          </Typography>
        )}
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
            Type
          </InputLabel>
          <Select
            label="Type"
            labelId="type-label"
            id="selectType"
            name="type"
            style={{ width: 160, marginLeft: 10, marginTop: 12 }}
            onChange={formik.handleChange}
            value={formik.values.type}
            error={formik.touched.type && Boolean(formik.errors.type)}
          >
            <MenuItem id="tools" value={'TOOLS'}>
              Tools
            </MenuItem>
            <MenuItem id="wages" value={'WAGES'}>
              Wages
            </MenuItem>
            <MenuItem id="other" value={'OTHER'}>
              Other
            </MenuItem>
          </Select>
        </Box>
        {operation === 'edit' ? (
          <Button color="primary" variant="contained" id="save_Expense" type="submit" style={{ marginTop: 20 }}>
            Save
          </Button>
        ) : (
          <Button color="primary" variant="contained" id="create_Expense" type="submit" style={{ marginTop: 20 }}>
            Create
          </Button>
        )}
      </Grid>
    </form>
  );
};

export default CreateExpense;
function setErrMessage(_arg0: string) {
  throw new Error('Function not implemented.');
}
