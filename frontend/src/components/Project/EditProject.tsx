import CreateProject from './CreateProject';
import { useLocation } from 'react-router';

interface Props {
  id?: string;
}

const EditProject: React.FC<Props> = ({ id }) => {
  const { search } = useLocation();

  const searchParams = new URLSearchParams(search);
  const edit = searchParams.get('edit');

  return (
    <div>
      <CreateProject id={id} edit={String(edit)}></CreateProject>
    </div>
  );
};

export default EditProject;
