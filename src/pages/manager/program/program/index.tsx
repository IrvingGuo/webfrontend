import ProgramList from '@/components/ProgramList';
import { defaultProgList, defaultUserList } from '../../share';
import { defaultActivityList, defaultSubprogramList } from '../share';

const ProgramManager: React.FC = () => {
  const setDefaultProgList = (progList: API.Program[]) => {
    defaultProgList.splice(0, defaultProgList.length, ...progList);
  };

  return (
    <ProgramList
      defaultUserList={defaultUserList}
      defaultProgList={defaultProgList}
      defaultSubprogramList={defaultSubprogramList}
      defaultActivityList={defaultActivityList}
      setDefaultProgList={setDefaultProgList}
    />
  );
};

export default ProgramManager;
