import ProgramList from '@/components/ProgramList';
import { ProjectOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Space } from 'antd';
import { useModel } from 'umi';
import { activityList, loginUserProgList, subprogramList } from '../share';

const content = (
  <Space>
    <ProjectOutlined />
    Review and edit your programs
  </Space>
);

const ProgramManager: React.FC = () => {
  const { initialState } = useModel('@@initialState');

  const setDefaultProgList = (progList: API.Program[]) => {
    loginUserProgList.splice(0, loginUserProgList.length, ...progList);
  };

  return (
    <PageContainer content={content}>
      <ProgramList
        defaultUserList={[initialState?.user ? initialState.user : {}]}
        defaultProgList={loginUserProgList}
        defaultSubprogramList={subprogramList}
        defaultActivityList={activityList}
        setDefaultProgList={setDefaultProgList}
      />
    </PageContainer>
  );
};

export default ProgramManager;
