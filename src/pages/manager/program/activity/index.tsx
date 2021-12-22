import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DrawerForm from './components/DrawerForm';
import ProCard from '@ant-design/pro-card';
import styles from '@/pages/styles.less';
import { getActivityFilterList, getActivityValueEnum } from '@/utils/entity-adapter.utils';
import { defaultActivityList } from '../share';

const emptyActivity: API.Activity = {
  id: 0,
  status: true,
};

type ActivityListProps = {
  cachedActivityList: API.Activity[];
  setCachedActivityList: (progList: API.Activity[]) => void;
};

const ActivityList: React.FC<ActivityListProps> = (props) => {
  const { cachedActivityList, setCachedActivityList } = props;

  const [visible, setVisible] = useState<boolean>(false);
  const [activityList, setActivityList] = useState<API.Activity[]>(cachedActivityList);
  const [curActivity, setCurActivity] = useState<API.Activity>(emptyActivity);

  const columns: ProColumns<API.Activity>[] = [
    {
      title: 'name',
      dataIndex: 'id',
      ellipsis: true,
      valueEnum: getActivityValueEnum(activityList),
      filters: getActivityFilterList(activityList),
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
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      fieldProps: {
        options: [
          {
            label: 'enabled',
            value: 1,
          },
          {
            text: 'disabled',
            value: 0,
          },
        ],
      },
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

  const onUpdateActivityList = (activity: API.Activity) => {
    const tmpActivityList = [...cachedActivityList];
    const foundActivityIdx = tmpActivityList.findIndex(
      (oriActivity) => oriActivity.id == activity.id,
    );
    if (foundActivityIdx >= 0) {
      tmpActivityList[foundActivityIdx] = activity;
    } else {
      tmpActivityList.unshift(activity);
    }
    setActivityList(tmpActivityList);
    setCachedActivityList(tmpActivityList);
  };

  const onDeleteActivityList = (progId: number) => {
    const tmpProgList = [...cachedActivityList];
    const foundProgIdx = tmpProgList.findIndex((oriProg) => oriProg.id == progId);
    if (foundProgIdx >= 0) {
      tmpProgList.splice(foundProgIdx, 1);
      setActivityList(tmpProgList);
      setCachedActivityList(tmpProgList);
    }
  };

  const onDrawerClose = () => {
    setVisible(false);
  };

  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <ProTable<API.Activity>
        bordered
        dataSource={activityList}
        scroll={{ x: 1 }}
        rowKey="id"
        defaultSize="small"
        headerTitle="Programs"
        columns={columns}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              setCurActivity(record);
              setVisible(true);
            },
          };
        }}
        dateFormatter="string"
        options={false}
        search={false}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setCurActivity({ ...emptyActivity });
              setVisible(true);
            }}
            icon={<PlusOutlined />}
          >
            New
          </Button>,
          <DrawerForm
            visible={visible}
            onVisibleClose={onDrawerClose}
            activity={curActivity}
            onUpdateActivityList={onUpdateActivityList}
            onDeleteActivityList={onDeleteActivityList}
          />,
        ]}
      />
    </ProCard>
  );
};

const ActivityManager: React.FC = () => {
  const setDefaultActivityList = (activityList: API.Activity[]) => {
    defaultActivityList.splice(0, defaultActivityList.length, ...activityList);
  };

  return (
    <ActivityList
      cachedActivityList={defaultActivityList}
      setCachedActivityList={setDefaultActivityList}
    />
  );
};

export default ActivityManager;
