import React from 'react';
import CreateProduction from './CreateProduction';

interface Props {
  id: string;
  productionEditId: string;
}

const EditProduction: React.FC<Props> = ({ id, productionEditId }) => {
  return <CreateProduction id={id} operation="edit" productionEditId={productionEditId}></CreateProduction>;
};

export default EditProduction;
