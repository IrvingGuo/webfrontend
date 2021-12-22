import React, { useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { compareDS, validateManMonth, validateProgram, pruneDS } from './utils/utils';
import {
  Button,
  DatePicker,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { FormOutlined, RedoOutlined } from '@ant-design/icons';
import {
  createAssignments,
  deleteAssignments,
  updateAssignments,
} from '@/services/apis/assignment';
import { ASSIGNMENT_PENDING, statusColorMap, statusNameMap } from '@/utils/constants';
import moment from 'moment';
import {
  defaultAssignmentList,
  defaultSuborList,
  progSelectList,
  progValueEnum,
} from '@/pages/resource/share';
import EmployeeList from './components/EmployeeList';
import { genTableCols, sumDateCols } from '@/utils/date-columns.utils';
import {
  convertAssignmentsToResPlanDSByUserId,
  convertResPlanDSToAssignmentList,
} from '@/utils/entity-adapter.utils';
import ProCard from '@ant-design/pro-card';
import styles from '@/pages/styles.less';

const { RangePicker } = DatePicker;
const { Text } = Typography;

const today = moment();
let startYearMonth = moment([today.year(), 0]);
let endYearMonth = moment([today.year(), 11]);

const commonColumns: ProColumns<Record<string, any>>[] = [
  {
    title: 'status',
    dataIndex: 'status',
    width: 88,
    fixed: 'left',
    align: 'center',
    editable: false,
    render: (_, record) => (
      <Tag color={statusColorMap.get(record.status)} key={record.status}>
        {statusNameMap.get(record.status)}
      </Tag>
    ),
  },
  {
    title: 'programs',
    dataIndex: 'programId',
    key: 'programId',
    ellipsis: true,
    width: 250,
    fixed: 'left',
    valueEnum: progValueEnum,
    renderFormItem: () => {
      return (
        <Select
          showSearch
          dropdownMatchSelectWidth={false}
          options={progSelectList}
          placeholder="Please select an owner"
          optionFilterProp="children"
          filterOption={(input, option: any) => {
            return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
          }}
          filterSort={(optionA: any, optionB: any) => {
            return optionA.label?.toLowerCase().localeCompare(optionB.label?.toLowerCase());
          }}
        />
      );
    },
  },
  {
    title: 'ops',
    valueType: 'option',
    width: 60,
    fixed: 'right',
  },
];

// ERROR: Can't perform a React state update on an unmounted component.
const AssignmentList: React.FC = () => {
  const [subor, setSubor] = useState<API.User>({});
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [popConformVisible, setPopConfirmVisible] = React.useState(false);
  const [columns, setColumns] = useState<ProColumns<Record<string, any>>[]>(
    genTableCols(startYearMonth, endYearMonth, commonColumns, subor.entryDate, subor.resignDate),
  );

  // for comparison to create, modify or delete assignment
  const [oriDataSource, setOriDataSource] = useState<Record<string, any>[]>([]);
  const [curDataSource, setCurDataSource] = useState<Record<string, any>[]>([]);

  const onDatesChange = (values: any) => {
    startYearMonth = moment([values[0].year(), 0]);
    endYearMonth = moment([values[1].year(), 11]);
    setColumns(
      genTableCols(startYearMonth, endYearMonth, commonColumns, subor.entryDate, subor.resignDate),
    );
  };

  const onSuborChange = (suborId: number) => {
    const foundSubor = defaultSuborList.find((innerSubor) => innerSubor.id == suborId);
    if (foundSubor && foundSubor.id) {
      setSubor(foundSubor);
      const ds = convertAssignmentsToResPlanDSByUserId(defaultAssignmentList, foundSubor.id);
      setOriDataSource(ds);
      setCurDataSource(ds.slice());
      setEditableRowKeys(ds.map((record) => record.key));
      setColumns(
        genTableCols(
          startYearMonth,
          endYearMonth,
          commonColumns,
          foundSubor.entryDate,
          foundSubor.resignDate,
        ),
      );
    }
  };

  const onSubmit = async () => {
    const dateCols = columns.slice(3);
    if (
      !validateManMonth(curDataSource, dateCols) ||
      !validateProgram(curDataSource, progSelectList)
    ) {
      return;
    }
    const [createItems, modifyItems, deleteItems] = compareDS(
      pruneDS(oriDataSource, dateCols),
      pruneDS(curDataSource, dateCols),
      subor.id ? subor.id : 0,
      subor.deptId ? subor.deptId : 0,
    );
    try {
      let result = undefined;
      let success = true;
      let modified = false;
      if (createItems.length > 0) {
        modified = true;
        result = await createAssignments(createItems);
        if (!result.success) {
          console.log(result.errorMessage);
          success = false;
        }
        // response data contains assignment id, reset them in persisted data
        result.data.forEach((assignment: API.Assignment) => {
          const foundRecord = curDataSource.find((record) => {
            return record.programId === assignment.programId && assignment.allocationTime in record;
          });
          if (foundRecord) {
            foundRecord[assignment.allocationTime + 'id'] = assignment.id;
          }
        });
      }

      if (modifyItems.length > 0) {
        modified = true;
        result = await updateAssignments(modifyItems);
        if (!result.success) {
          console.log(result.errorMessage);
          success = false;
        }
      }

      if (deleteItems.length > 0) {
        modified = true;
        result = await deleteAssignments(deleteItems);
        if (!result.success) {
          console.log(result.errorMessage);
          success = false;
        }
      }

      if (modified) {
        if (success) {
          setOriDataSource(curDataSource.slice());
          const newList = defaultAssignmentList.filter(
            (assignment) => assignment.userId != subor.id,
          ); // remove assignments belong to this user
          newList.push(
            ...convertResPlanDSToAssignmentList(
              curDataSource,
              subor.id ? subor.id : 0,
              subor.deptId ? subor.deptId : 0,
            ),
          ); // add new ones
          defaultAssignmentList.splice(0, defaultAssignmentList.length, ...newList); // reset values in const list
          message.success('update successfully');
        }
      } else {
        message.info('nothing changed');
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <EditableProTable<Record<string, any>>
        rowKey="key"
        bordered
        defaultSize="small"
        headerTitle={
          <Space>
            <EmployeeList onSuborChange={onSuborChange} />
          </Space>
        }
        columns={columns}
        value={curDataSource}
        onChange={setCurDataSource}
        scroll={{ x: 1 }}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        recordCreatorProps={
          subor.id
            ? {
                position: 'bottom',
                record: () => ({
                  key: Date.now(),
                  userId: subor.id,
                  status: ASSIGNMENT_PENDING,
                }),
                newRecordType: 'dataSource',
              }
            : false
        }
        editable={{
          type: 'multiple',
          editableKeys,
          actionRender: (row, config, defaultDoms) => {
            return [defaultDoms.delete];
          },
          onValuesChange: (record, recordList) => {
            setCurDataSource(recordList);
          },
          onChange: setEditableRowKeys,
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
          <Button key="submit" type="primary" icon={<FormOutlined />} onClick={onSubmit}>
            Submit
          </Button>,
          <Popconfirm
            title="Are you sure to reset?"
            visible={popConformVisible}
            onConfirm={() => {
              setCurDataSource(oriDataSource.slice());
              setEditableRowKeys(oriDataSource.map((record) => record.key));
              setPopConfirmVisible(false);
            }}
            onCancel={() => setPopConfirmVisible(false)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              key="reset"
              icon={<RedoOutlined />}
              onClick={() => setPopConfirmVisible(true)}
              danger
              disabled // TODO: reset not work on editable rows
            >
              Reset
            </Button>
          </Popconfirm>,
        ]}
        summary={(records) => {
          if (records.length == 0) {
            return undefined;
          }
          const sumMap = sumDateCols(columns.slice(3), records);
          let index = 0;
          let innerKey = 0; // to avoid console error

          return (
            <Table.Summary fixed>
              <Table.Summary.Row>
                <Table.Summary.Cell index={index++} />
                <Table.Summary.Cell align="center" index={index++}>
                  Total
                </Table.Summary.Cell>
                {Array.from(sumMap).map(([, v]) => (
                  <Table.Summary.Cell index={index++} key={innerKey++} align="center">
                    <Text type={v == 1 ? 'success' : 'danger'}>{v}</Text>
                  </Table.Summary.Cell>
                ))}
                <Table.Summary.Cell index={index++} />
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
      />
    </ProCard>
  );
};

export default AssignmentList;
