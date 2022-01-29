import React from 'react';
import CreateExpense from './CreateExpense';

interface Props {
  id: string;
  expenseEditId: string;
}

const EditExpense: React.FC<Props> = ({ id, expenseEditId }) => {
  return <CreateExpense id={id} operation="edit" expenseEditId={expenseEditId}></CreateExpense>;
};

export default EditExpense;
