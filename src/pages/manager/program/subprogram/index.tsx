import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DrawerForm from './components/DrawerForm';
import ProCard from '@ant-design/pro-card';
import styles from '@/pages/styles.less';
import { getSubprogramFilterList, getSubprogramValueEnum } from '@/utils/entity-adapter.utils';
import { defaultSubprogramList } from '../share';

const emptySubprogram: API.Subprogram = {
  id: 0,
  status: true,
};

type SubprogramListProps = {
  cachedSubprogramList: API.Subprogram[];
  setCachedSubprogramList: (progList: API.Subprogram[]) => void;
};

const SubprogramList: React.FC<SubprogramListProps> = (props) => {
  const { cachedSubprogramList, setCachedSubprogramList } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [subprogramList, setSubprogramList] = useState<API.Subprogram[]>(cachedSubprogramList);
  const [curSubprogram, setCurSubprogram] = useState<API.Subprogram>(emptySubprogram);

  const columns: ProColumns<API.Subprogram>[] = [
    {
      title: 'name',
      dataIndex: 'id',
      ellipsis: true,
      valueEnum: getSubprogramValueEnum(subprogramList),
      filters: getSubprogramFilterList(subprogramList),
      filterSearch: true,
      onFilter: (value, record) => {
        if (record.id) {
          return record.id == value;
        } else {
          return false;
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

  const onUpdateSubprogramList = (subprogram: API.Subprogram) => {
    const tmpSubprogramList = [...cachedSubprogramList];
    const foundSubprogramIdx = tmpSubprogramList.findIndex(
      (oriSubprogram) => oriSubprogram.id == subprogram.id,
    );
    if (foundSubprogramIdx >= 0) {
      tmpSubprogramList[foundSubprogramIdx] = subprogram;
    } else {
      tmpSubprogramList.unshift(subprogram);
    }
    setSubprogramList(tmpSubprogramList);
    setCachedSubprogramList(tmpSubprogramList);
  };

  const onDeleteSubprogramList = (progId: number) => {
    const tmpProgList = [...cachedSubprogramList];
    const foundProgIdx = tmpProgList.findIndex((oriProg) => oriProg.id == progId);
    if (foundProgIdx >= 0) {
      tmpProgList.splice(foundProgIdx, 1);
      setSubprogramList(tmpProgList);
      setCachedSubprogramList(tmpProgList);
    }
  };

  const onDrawerClose = () => {
    setVisible(false);
  };

  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <ProTable<API.Subprogram>
        bordered
        dataSource={subprogramList}
        scroll={{ x: 1, y: 1000 }}
        rowKey="id"
        headerTitle="Programs"
        defaultSize="small"
        columns={columns}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setCurSubprogram(record);
              setVisible(true);
            },
          };
        }}
        dateFormatter="string"
        search={false}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setCurSubprogram({ ...emptySubprogram });
              setVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            New
          </Button>,
          <DrawerForm
            visible={visible}
            onVisibleClose={onDrawerClose}
            subprogram={curSubprogram}
            onUpdateSubprogramList={onUpdateSubprogramList}
            onDeleteSubprogramList={onDeleteSubprogramList}
          />,
        ]}
      />
    </ProCard>
  );
};

const SubprogramManager: React.FC = () => {
  const setDefaultSubprogramList = (subprogramList: API.Subprogram[]) => {
    defaultSubprogramList.splice(0, defaultSubprogramList.length, ...subprogramList);
  };

  return (
    <SubprogramList
      cachedSubprogramList={defaultSubprogramList}
      setCachedSubprogramList={setDefaultSubprogramList}
    />
  );
};

export default SubprogramManager;
