import CreateTask from './CreateTask';
import { useLocation } from 'react-router';

interface Props {
  id?: string;
}

const EditTask: React.FC<Props> = ({ id }) => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const edit = searchParams.get('edit');

  return (
    <div>
      <CreateTask id={id} edit={edit}></CreateTask>
    </div>
  );
};

export default EditTask;
