import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { convertIntToBinary } from './utils/utils';
import DrawerForm from './components/DrawerForm';
import { getDeptCascaderList } from './utils/request';
import { defaultEntryDate, defaultResignDate, privColorMap, privNameMap } from '@/utils/constants';
import ProCard from '@ant-design/pro-card';
import styles from '@/pages/styles.less';
import {
  getDeptValueEnum,
  getDeptFilterList,
  getUserValueEnum,
  getUserFilterList,
} from '@/utils/entity-adapter.utils';

const emptyUser: API.User = {
  id: 0,
  entryDate: defaultEntryDate,
  resignDate: defaultResignDate,
};

type UserListProps = {
  defaultDeptList: API.Department[];
  defaultUserList: API.User[];
  setDefaultUserList: (userList: API.User[]) => void;
  disablePrivilege: boolean;
};

const Users: React.FC<UserListProps> = (props) => {
  const { defaultDeptList, defaultUserList, setDefaultUserList, disablePrivilege } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [userList, setUserList] = useState<API.User[]>(defaultUserList);
  const [curUser, setCurUser] = useState<API.User>(emptyUser);

  const columns: ProColumns<API.User>[] = [
    {
      title: 'name',
      dataIndex: 'id',
      ellipsis: true,
      valueType: 'select',
      valueEnum: getUserValueEnum(userList),
      filters: getUserFilterList(userList),
      filterSearch: true,
      onFilter: (value, record) => {
        if (record.id) {
          return record.id == value;
        } else {
          return false;
        }
      },
      sorter: (a, b) => {
        if (a.id && b.id) {
          return a.id - b.id;
        } else {
          return 0;
        }
      },
    },
    {
      title: 'department',
      dataIndex: 'deptId',
      ellipsis: true,
      valueType: 'select',
      valueEnum: getDeptValueEnum(defaultDeptList),
      filters: getDeptFilterList(defaultDeptList),
      filterSearch: true,
      onFilter: (value, record) => {
        if (record.deptId) {
          return record.deptId == value;
        } else {
          return false;
        }
      },
      sorter: (a, b) => {
        if (a.deptId && b.deptId) {
          return a.deptId - b.deptId;
        } else {
          return 0;
        }
      },
    },
    {
      title: 'title',
      dataIndex: 'title',
      ellipsis: true,
      search: false,
    },
    {
      title: 'win account',
      dataIndex: 'sAMAccount',
      ellipsis: true,
      search: false,
    },
    {
      title: 'entry date',
      dataIndex: 'entryDate',
      valueType: 'date',
      ellipsis: true,
      search: false,
      sorter: (a, b) => {
        if (a.entryDate && b.entryDate) {
          return a.entryDate.localeCompare(b.entryDate);
        } else {
          return 0;
        }
      },
    },
    {
      title: 'resign date',
      dataIndex: 'resignDate',
      valueType: 'date',
      ellipsis: true,
      search: false,
      sorter: (a, b) => {
        if (a.resignDate && b.resignDate) {
          return a.resignDate.localeCompare(b.resignDate);
        } else {
          return 0;
        }
      },
    },
    {
      title: 'location',
      dataIndex: 'location',
      ellipsis: true,
      search: false,
      valueType: 'select',
      valueEnum: {
        Ningbo: {
          text: 'Ningbo',
        },
        Dalian: {
          text: 'Dalian',
        },
        Shanghai: {
          text: 'Shanghai',
        },
      },
      filters: true,
      sorter: (a, b) => {
        if (a.location && b.location) {
          return a.location.localeCompare(b.location);
        } else {
          return 0;
        }
      },
    },
    {
      title: 'type',
      dataIndex: 'resourceType',
      ellipsis: true,
      search: false,
      filters: true,
      valueType: 'select',
      valueEnum: {
        internal: {
          text: 'internal',
        },
        external: {
          text: 'external',
        },
      },
      sorter: (a, b) => {
        if (a.resourceType && b.resourceType) {
          return a.resourceType.localeCompare(b.resourceType);
        } else {
          return 0;
        }
      },
    },
    {
      title: 'privilege',
      dataIndex: 'privilege',
      search: false,
      ellipsis: true,
      renderFormItem: (_, { defaultRender }) => {
        return defaultRender(_);
      },
      render: (_, record) =>
        convertIntToBinary(record.privilege).map((priv: number) => (
          <Tag color={privColorMap.get(priv)} key={priv}>
            {privNameMap.get(priv)}
          </Tag>
        )),
    },
    {
      title: 'status',
      dataIndex: 'status',
      search: false,
    },
  ];

  const onUpdateUserList = (user: API.User) => {
    const tmpUserList = [...defaultUserList];
    const foundUserIdx = tmpUserList.findIndex((oriUser) => oriUser.id == user.id);
    if (foundUserIdx >= 0) {
      tmpUserList[foundUserIdx] = user;
    } else {
      tmpUserList.unshift(user);
    }
    setUserList(tmpUserList);
    setDefaultUserList(tmpUserList);
  };

  const onDeleteUserList = (userId: number) => {
    const tmpUserList = [...defaultUserList];
    const foundUserIdx = tmpUserList.findIndex((oriUser) => oriUser.id == userId);
    if (foundUserIdx >= 0) {
      tmpUserList.splice(foundUserIdx, 1);
      setUserList(tmpUserList);
      setDefaultUserList(tmpUserList);
    }
  };

  const onSetDeptCascader = (deptId: number) => {
    const foundDept = defaultDeptList.find((dept) => dept.id == deptId);
    if (foundDept && foundDept.level) {
      const result = foundDept.level.split('.').slice(1).map(Number);
      result.push(deptId);
      return result;
    } else {
      return [];
    }
  };

  const onDrawerClose = () => {
    setVisible(false);
  };

  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <ProTable<API.User>
        bordered
        dataSource={userList}
        rowKey="id"
        headerTitle="Users"
        columns={columns}
        onRow={(record) => {
          return {
            onClick: () => {
              setCurUser(record);
              setVisible(true);
            },
          };
        }}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        dateFormatter="string"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setCurUser({ ...emptyUser });
              setVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            New
          </Button>,
          <DrawerForm
            visible={visible}
            onVisibleClose={onDrawerClose}
            user={curUser}
            userList={userList}
            onUpdateUserList={onUpdateUserList}
            onDeleteUserList={onDeleteUserList}
            deptCascaderList={getDeptCascaderList(defaultDeptList)}
            onSetDeptCascader={onSetDeptCascader}
            disablePrivilege={disablePrivilege}
          />,
        ]}
      />
    </ProCard>
  );
};

export default Users;
