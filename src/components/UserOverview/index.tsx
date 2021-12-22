import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DatePicker, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import {
  convertAssignmentsToUserDS,
  getUserFilterList,
  getUserValueEnum,
} from '@/utils/entity-adapter.utils';
import { genTableCols, sumDateCols, sumTotal } from '@/utils/date-columns.utils';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const today = moment();
let startYearMonth = moment([today.year(), 0]);
let endYearMonth = moment([today.year(), 11]);

type ProgramOverviewProps = {
  userList: API.User[];
  assignmentList: API.Assignment[];
};

const ProgramOverview: React.FC<ProgramOverviewProps> = (props) => {
  const { userList, assignmentList } = props;
  const dataSource = convertAssignmentsToUserDS(assignmentList);

  const commonColumns: ProColumns<Record<string, any>>[] = [
    {
      title: 'Users',
      dataIndex: 'userId',
      key: 'userId',
      ellipsis: true,
      width: 150,
      fixed: 'left',
      valueEnum: getUserValueEnum(userList),
      filters: getUserFilterList(userList),
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
      title: (
        <>
          Total
          <Tooltip placement="top" title="including hided date columns">
            <QuestionCircleOutlined style={{ marginLeft: 4 }} />
          </Tooltip>
        </>
      ),
      dataIndex: 'total',
      width: 50,
      fixed: 'right',
    },
  ];

  const [columns, setColumns] = useState<ProColumns<Record<string, any>>[]>(
    genTableCols(startYearMonth, endYearMonth, commonColumns),
  );

  const onDatesChange = (values: any) => {
    startYearMonth = moment([values[0].year(), 0]);
    endYearMonth = moment([values[1].year(), 11]);
    setColumns(genTableCols(startYearMonth, endYearMonth, commonColumns));
  };

  return (
    <ProTable<Record<string, any>>
      rowKey="key"
      bordered
      defaultSize="small"
      headerTitle={'User Overview'}
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
          defaultValue={[startYearMonth, endYearMonth]}
          disabledDate={(date) => {
            const curDate = moment();
            return date < curDate.startOf('year') || date > curDate.endOf('year').add(3, 'year');
          }}
        />,
      ]}
      summary={(records) => {
        if (records.length == 0) {
          return undefined;
        }
        const sumMap = sumDateCols(columns.slice(2), records);
        let index = 0;
        let innerKey = 0; // to avoid console error

        return (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell align="center" index={index++}>
                Total
                <Tooltip placement="top" title="exclude hided rows">
                  <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                </Tooltip>
              </Table.Summary.Cell>
              {Array.from(sumMap).map(([, v]) => (
                <Table.Summary.Cell index={index++} key={innerKey++} align="center">
                  <Text>{v}</Text>
                </Table.Summary.Cell>
              ))}
              <Table.Summary.Cell index={index++} align="center">
                <Text>{sumTotal(records)}</Text>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          </Table.Summary>
        );
      }}
    />
  );
};

export default ProgramOverview;
