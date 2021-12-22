import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import DrawerForm from './components/DrawerForm';
import { Button, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { getDeptCascaderList, getDeptList } from './utils/utils';
import type { DataNode } from 'rc-cascader/lib/interface';
import { defaultDeptList, defaultUserList } from '../share';
import ProCard from '@ant-design/pro-card';
import styles from '@/pages/styles.less';
import { PageContainer } from '@ant-design/pro-layout';
import { DeptIcon } from '@/pages/icon';
import { getUserValueEnum, getUserSelectList } from '@/utils/entity-adapter.utils';

const content = (
  <Space>
    <DeptIcon />
    Review and edit all departments
  </Space>
);

const emptyDept: API.Department = {
  id: 0,
};

const Department: React.FC = () => {
  const leveledDeptList = getDeptList(defaultDeptList);
  const cascaderDeptList = getDeptCascaderList(defaultDeptList);

  const columns: ProColumns<API.Department>[] = [
    {
      title: '部门',
      dataIndex: 'name',
      width: '30%',
    },
    {
      title: '部长',
      key: 'userId',
      dataIndex: 'userId',
      valueType: 'select',
      valueEnum: getUserValueEnum(defaultUserList),
    },
  ];

  const [visible, setVisible] = useState<boolean>(false);
  const [deptList, setDeptList] = useState<API.Department[]>(leveledDeptList);
  const [deptCascaderList, setDeptCascaderList] = useState<DataNode[]>(cascaderDeptList);
  const [curDept, setCurDept] = useState<API.Department>(emptyDept);

  const onUpdateOriDeptList = (dept: API.Department) => {
    const foundOriDeptIdx = defaultDeptList.findIndex((oriDept) => oriDept.id == dept.id);
    if (foundOriDeptIdx >= 0) {
      defaultDeptList[foundOriDeptIdx] = dept;
    } else {
      defaultDeptList.push(dept);
    }
    setDeptList(getDeptList(defaultDeptList));
    setDeptCascaderList(getDeptCascaderList(defaultDeptList));
  };

  const onDrawerClose = () => {
    setVisible(false);
  };

  return (
    <PageContainer content={content}>
      <ProCard className={styles['card-shadow-radius-border']}>
        <ProTable<API.Department>
          bordered
          expandable={{
            defaultExpandAllRows: true,
          }}
          dataSource={deptList}
          rowKey="id"
          headerTitle="Department"
          columns={columns}
          search={false}
          options={false}
          pagination={false}
          onRow={(record) => {
            return {
              onClick: () => {
                setCurDept(record);
                setVisible(true);
              },
            };
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                setCurDept({ ...emptyDept });
                setVisible(true);
              }}
              icon={<PlusOutlined />}
            >
              New
            </Button>,
            <DrawerForm
              visible={visible}
              onVisibleClose={onDrawerClose}
              userSelectList={getUserSelectList(defaultUserList)}
              deptCascaderList={deptCascaderList}
              dept={curDept}
              onUpdateOriDeptList={onUpdateOriDeptList}
            />,
          ]}
        />
      </ProCard>
    </PageContainer>
  );
};

export default Department;
