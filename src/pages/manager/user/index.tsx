import UserList from '@/components/UserList';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-layout';
import { Space } from 'antd';
import { defaultDeptList, defaultUserList } from '../share';

const content = (
  <Space>
    <UsergroupAddOutlined />
    Review and edit all users
  </Space>
);

const UserManager: React.FC = () => {
  const setDefaultUserList = (userList: API.User[]) => {
    defaultUserList.splice(0, defaultUserList.length, ...userList);
  };

  return (
    <PageContainer content={content}>
      <UserList
        defaultDeptList={defaultDeptList}
        defaultUserList={defaultUserList}
        setDefaultUserList={setDefaultUserList}
        disablePrivilege={false}
      />
    </PageContainer>
  );
};

export default UserManager;
