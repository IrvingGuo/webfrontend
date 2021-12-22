import React, { useState, useEffect } from 'react';
import type { ProSchemaValueEnumMap } from '@ant-design/pro-utils';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import {
  onHandleChangeStatus,
  onHandleChangeStatusInBatch,
  onHandleGetAssignments,
} from './utils/request';
import type { Moment } from 'moment';
import {
  ASSIGNMENT_APPROVED,
  ASSIGNMENT_REJECTED,
  statusColorMap,
  statusNameMap,
} from '@/utils/constants';
import { Button, message, Tag } from 'antd';
import { genDateColsFromYearsMonths } from '@/utils/date-columns.utils';

type AssignmentListProps = {
  program: API.Program;
};

const AssignmentList: React.FC<AssignmentListProps> = (props) => {
  const { program } = props;

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<Record<string, any>[]>([]);
  const [columns, setColumns] = useState<ProColumns<Record<string, any>>[]>([
    {
      title: 'Hi',
      dataIndex: 'Hi',
    },
  ]);

  const genTableCols = (
    userValueEnum: ProSchemaValueEnumMap,
    start?: Moment,
    end?: Moment,
  ): ProColumns<Record<string, any>>[] => {
    const commonColumns: ProColumns<Record<string, any>>[] = [
      {
        title: 'status',
        dataIndex: 'status',
        width: 88,
        fixed: 'left',
        align: 'center',
        renderFormItem: (_, { defaultRender }) => {
          return defaultRender(_);
        },
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
        editable: false,
        valueType: 'select',
        valueEnum: userValueEnum,
        ellipsis: true,
      },
      {
        title: 'ops',
        valueType: 'option',
        width: 151,
        fixed: 'right',
        render: (text, record, _, action) => [
          <a
            key="approve"
            onClick={() => {
              if (record.status != ASSIGNMENT_APPROVED) {
                action?.startEditable?.(record.key);
                onHandleChangeStatus(record, ASSIGNMENT_APPROVED);
                record.status = ASSIGNMENT_APPROVED;
                action?.cancelEditable?.(record.key);
                message.success('approve successfully');
              }
            }}
          >
            <Tag color="success">approve</Tag>
          </a>,
          <a
            key="reject"
            onClick={() => {
              if (record.status != ASSIGNMENT_REJECTED) {
                action?.startEditable?.(record.key);
                onHandleChangeStatus(record, ASSIGNMENT_REJECTED);
                record.status = ASSIGNMENT_REJECTED;
                action?.cancelEditable?.(record.key);
                message.success('reject successfully');
              }
            }}
          >
            <Tag color="error">reject</Tag>
          </a>,
        ],
      },
    ];
    const colsTemplate = Object.assign([], commonColumns);
    if (!start || !end) {
      return colsTemplate;
    }
    const dateCols = genDateColsFromYearsMonths(start, end);
    colsTemplate.splice(2, 0, ...dateCols);
    return colsTemplate;
  };

  useEffect(() => {
    if (program.id != -1 && program.name) {
      onHandleGetAssignments(program.id).then(({ ds, dates, userValueEnum }) => {
        if (ds.length > 0) {
          setColumns(genTableCols(userValueEnum, dates[0], dates[1]));
          setDataSource(ds);
        } else {
          setColumns([
            {
              title: 'No data',
              dataIndex: 'no data',
              width: 33,
            },
          ]);
          setDataSource([]);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [program]);

  const onChangeAllStates = (status: number) => {
    if (dataSource.length > 0) {
      const ds = [...dataSource];
      onHandleChangeStatusInBatch(ds, status);
      ds.forEach((record) => {
        record.status = status;
      });
      setDataSource(ds);
      message.success('change status successfully');
    } else {
      message.info('no data provided');
    }
  };

  const onApproveAll = () => onChangeAllStates(ASSIGNMENT_APPROVED);

  const onRejectAll = () => onChangeAllStates(ASSIGNMENT_REJECTED);

  return (
    <>
      <ProTable<Record<string, any>>
        rowKey="key"
        bordered
        defaultSize="small"
        headerTitle={program.name}
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1 }}
        search={false}
        options={false}
        pagination={{
          pageSize: 10,
          hideOnSinglePage: true,
        }}
        editable={{
          type: 'single',
          editableKeys,
          onChange: setEditableRowKeys,
        }}
        toolBarRender={
          dataSource.length > 0
            ? () => [
                <a key="approveAll" onClick={onApproveAll}>
                  <Tag icon={<CheckCircleOutlined />} color="success">
                    approve all
                  </Tag>
                </a>,
                <a key="rejectAll" onClick={onRejectAll}>
                  <Tag icon={<CloseCircleOutlined />} color="error">
                    reject all
                  </Tag>
                </a>,
              ]
            : () => [<Button hidden>Approve all</Button>]
        }
      />
    </>
  );
};

export default AssignmentList;
