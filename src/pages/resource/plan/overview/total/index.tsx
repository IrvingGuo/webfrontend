import { statusColorMap, statusNameMap } from '@/utils/constants';
import ProCard from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DatePicker, Tag } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import {
  allPrograms,
  defaultAssignmentList,
  defaultSuborList,
  progValueEnum,
} from '../../../share';
import styles from '@/pages/styles.less';
import {
  getProgFilterList,
  getUserValueEnum,
  getUserFilterList,
  convertAssignmentsToResPlanDS,
} from '@/utils/entity-adapter.utils';
import { genTableCols } from '@/utils/date-columns.utils';

const { RangePicker } = DatePicker;

const today = moment();
let startYearMonth = moment([today.year(), 0]);
let endYearMonth = moment([today.year() + 3, 11]);

const commonColumns: ProColumns<Record<string, any>>[] = [
  {
    title: 'status',
    dataIndex: 'status',
    width: 88,
    fixed: 'left',
    align: 'center',
    render: (_, record) => (
      <Tag color={statusColorMap.get(record.status)} key={record.status}>
        {statusNameMap.get(record.status)}
      </Tag>
    ),
  },
  {
    title: 'employee',
    dataIndex: 'userId',
    width: 100,
    fixed: 'left',
    valueEnum: getUserValueEnum(defaultSuborList),
    ellipsis: true,
    filters: getUserFilterList(defaultSuborList),
    filterSearch: true,
    onFilter: (value, record) => {
      if (record.userId) {
        return record.userId == value;
      } else {
        return false;
      }
    },
    sorter: (a, b) => {
      if (a.userId && b.userId) {
        return a.userId - b.userId;
      } else {
        return 0;
      }
    },
  },
  {
    title: 'programs',
    dataIndex: 'programId',
    key: 'programId',
    ellipsis: true,
    width: 150,
    fixed: 'left',
    valueEnum: progValueEnum,
    filters: getProgFilterList(allPrograms),
    filterSearch: true,
    onFilter: (value, record) => {
      if (record.programId) {
        return record.programId == value;
      } else {
        return false;
      }
    },
    sorter: (a, b) => {
      if (a.programId && b.programId) {
        return a.programId - b.programId;
      } else {
        return 0;
      }
    },
  },
];

const ResPlanOverview: React.FC = () => {
  const dataSource = convertAssignmentsToResPlanDS(defaultAssignmentList, defaultSuborList);

  const [columns, setColumns] = useState<ProColumns<Record<string, any>>[]>(
    genTableCols(startYearMonth, endYearMonth, commonColumns),
  );

  const onDatesChange = (values: any) => {
    startYearMonth = moment([values[0].year(), 0]);
    endYearMonth = moment([values[1].year(), 11]);
    setColumns(genTableCols(startYearMonth, endYearMonth, commonColumns));
  };

  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <ProTable<Record<string, any>>
        rowKey="key"
        bordered
        defaultSize="small"
        headerTitle={'Resource Plan Overview'}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1 }}
        search={false}
        options={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        toolBarRender={() => [
          <RangePicker
            picker="year"
            onChange={onDatesChange}
            defaultValue={[today, today]}
            disabledDate={(date) => {
              const curDate = moment();
              return date < curDate.startOf('year') || date > curDate.endOf('year').add(3, 'year');
            }}
          />,
        ]}
      />
    </ProCard>
  );
};

export default ResPlanOverview;
