import UserList from '@/components/UserList';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Space } from 'antd';
import { defaultSuborList, loginUserDeptList } from '../share';

const content = (
  <Space>
    <UsergroupAddOutlined />
    Review and edit your subordinates
  </Space>
);

const ManagerUser: React.FC = () => {
  const setDefaultUserList = (userList: API.User[]) => {
    defaultSuborList.splice(0, defaultSuborList.length, ...userList);
  };

  return (
    <PageContainer content={content}>
      <UserList
        defaultDeptList={loginUserDeptList}
        defaultUserList={defaultSuborList}
        setDefaultUserList={setDefaultUserList}
        disablePrivilege={true}
      />
    </PageContainer>
  );
};

export default ManagerUser;
