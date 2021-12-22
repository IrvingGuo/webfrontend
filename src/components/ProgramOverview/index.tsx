import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { DatePicker, Table, Tooltip, Typography } from 'antd';
import moment from 'moment';
import { useState } from 'react';
import {
  convertAssignmentsToProgramDS,
  getProgFilterList,
  getProgValueEnum,
} from '@/utils/entity-adapter.utils';
import { genTableCols, sumDateCols, sumTotal } from '@/utils/date-columns.utils';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const today = moment();
let startYearMonth = moment([today.year(), 0]);
let endYearMonth = moment([today.year(), 11]);

type ProgramOverviewProps = {
  programList: API.Program[];
  assignmentList: API.Assignment[];
};

const ProgramOverview: React.FC<ProgramOverviewProps> = (props) => {
  const { programList, assignmentList } = props;
  const dataSource = convertAssignmentsToProgramDS(assignmentList);

  const commonColumns: ProColumns<Record<string, any>>[] = [
    {
      title: 'Programs',
      dataIndex: 'programId',
      ellipsis: true,
      width: 150,
      fixed: 'left',
      valueEnum: getProgValueEnum(programList),
      filters: getProgFilterList(programList),
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
      headerTitle={'Program Overview'}
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
