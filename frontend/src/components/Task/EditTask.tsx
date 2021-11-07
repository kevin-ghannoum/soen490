import CreateTask from './CreateTask';

interface Props {
  id?: string;
  edit?: string;
}

const EditTask: React.FC<Props> = ({ id, edit}) => {
  return (
    <div>
      <CreateTask id={id} edit={edit}></CreateTask>
    </div>
  );
};

export default EditTask;
