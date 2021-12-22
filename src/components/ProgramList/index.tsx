import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DrawerForm from './components/DrawerForm';
import ProCard from '@ant-design/pro-card';
import styles from '@/pages/styles.less';
import {
  getProgFilterList,
  getUserValueEnum,
  getUserSelectList,
  getProgValueEnum,
} from '@/utils/entity-adapter.utils';

const emptyProg: API.Program = {
  id: 0,
};

type ProgramListProps = {
  defaultUserList: API.User[];
  defaultProgList: API.Program[];
  defaultSubprogramList: API.Subprogram[];
  defaultActivityList: API.Activity[];
  setDefaultProgList: (progList: API.Program[]) => void;
};

const ProgramList: React.FC<ProgramListProps> = (props) => {
  const {
    defaultUserList,
    defaultProgList,
    defaultSubprogramList,
    defaultActivityList,
    setDefaultProgList,
  } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [progList, setProgList] = useState<API.Program[]>(defaultProgList);
  const [curProg, setCurProg] = useState<API.Program>(emptyProg);

  const columns: ProColumns<API.Program>[] = [
    {
      title: 'name',
      dataIndex: 'id',
      ellipsis: true,
      valueEnum: getProgValueEnum(progList),
      filters: getProgFilterList(progList),
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
      title: 'type',
      dataIndex: 'type',
      ellipsis: true,
      valueType: 'select',
      filters: true,
      valueEnum: {
        'Non-Program': {
          text: 'Non-Program',
        },
        'Awarded Program': {
          text: 'Awarded Program',
        },
        'Expected Program': {
          text: 'Expected Program',
        },
        'Internal Program': {
          text: 'Internal Program',
        },
      },
    },
    {
      title: 'tpm',
      dataIndex: 'userId',
      ellipsis: true,
      valueType: 'select',
      valueEnum: getUserValueEnum(defaultUserList),
    },
    {
      title: 'close date',
      dataIndex: 'closeDate',
      valueType: 'date',
      ellipsis: true,
      sorter: (a, b) => {
        if (a.closeDate && b.closeDate) {
          return a.closeDate.localeCompare(b.closeDate);
        } else {
          return 0;
        }
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      valueType: 'checkbox',
      filters: [
        {
          text: 'enabled',
          value: 1,
        },
        {
          text: 'disabled',
          value: 0,
        },
      ],
      onFilter: (value, record) => {
        if (record.status) {
          return record.status == value;
        } else {
          return false;
        }
      },
      render: (text, record) => [
        record.status ? (
          <Tag color="success" key={1}>
            enabled
          </Tag>
        ) : (
          <Tag color="error" key={2}>
            disabled
          </Tag>
        ),
      ],
    },
  ];

  const onUpdateProgList = (prog: API.Program) => {
    const tmpProgList = [...defaultProgList];
    const foundSuborIdx = tmpProgList.findIndex((oriProg) => oriProg.id == prog.id);
    if (foundSuborIdx >= 0) {
      tmpProgList[foundSuborIdx] = prog;
    } else {
      tmpProgList.unshift(prog);
    }
    setProgList(tmpProgList);
    setDefaultProgList(tmpProgList);
  };

  const onDeleteProgList = (progId: number) => {
    const tmpProgList = [...defaultProgList];
    const foundProgIdx = tmpProgList.findIndex((oriProg) => oriProg.id == progId);
    if (foundProgIdx >= 0) {
      tmpProgList.splice(foundProgIdx, 1);
      setProgList(tmpProgList);
      setDefaultProgList(tmpProgList);
    }
  };

  const onDrawerClose = () => {
    setVisible(false);
  };

  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <ProTable<API.Program>
        bordered
        dataSource={progList}
        scroll={{ x: 1 }}
        rowKey="id"
        headerTitle="Programs"
        columns={columns}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setCurProg(record);
              setVisible(true);
            },
          };
        }}
        dateFormatter="string"
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setCurProg({ ...emptyProg });
              setVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            New
          </Button>,
          <DrawerForm
            visible={visible}
            onVisibleClose={onDrawerClose}
            prog={curProg}
            onUpdateProgList={onUpdateProgList}
            onDeleteProgList={onDeleteProgList}
            subprogramList={defaultSubprogramList}
            activityList={defaultActivityList}
            userSelectList={getUserSelectList(defaultUserList)}
          />,
        ]}
      />
    </ProCard>
  );
};

export default ProgramList;
