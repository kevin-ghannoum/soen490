import { Box, Button, Grid, Typography } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { deleteTransaction } from '../../services/TransactionAPI';

interface Props {
  id: string;
  transactionType: string;
  closeModalExpense: (values: any) => void;
  closeModalProduction: (values: any) => void;
}

const DeleteModalTransaction: React.FC<Props> = ({ id, transactionType, closeModalExpense, closeModalProduction }) => {
  const history = useHistory();

  const handleDeleteTransaction = async () => {
    try {
      await deleteTransaction(Number(id));
      history.go(0);
    } catch (err: any) {
      history.push('/error');
    }
  };

  return (
    <Grid container spacing={0} direction="column" alignItems="center" justifyContent="center">
      <Typography variant="subtitle1" style={{ fontWeight: 'bold', marginBottom: 10 }}>
        Are you sure you want to delete this {transactionType}?
      </Typography>
      <Box style={{ display: 'flex' }}>
        <Button
          color="primary"
          variant="contained"
          id="deleteYes"
          style={{ margin: 10 }}
          onClick={handleDeleteTransaction}
        >
          Yes
        </Button>
        {transactionType === 'expense' ? (
          <Button
            color="primary"
            variant="contained"
            id="deleteNoExpense"
            onClick={closeModalExpense}
            style={{ margin: 10 }}
          >
            No
          </Button>
        ) : (
          <Button
            color="primary"
            variant="contained"
            id="deleteNoProduction"
            onClick={closeModalProduction}
            style={{ margin: 10 }}
          >
            No
          </Button>
        )}
      </Box>
    </Grid>
  );
};

export default DeleteModalTransaction;
