import { loginUserProgList } from '@/pages/tpm/share';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import styles from './split.less';

type ProgramListProps = {
  program: API.Program;
  onProgramChange: (subor: API.Program) => void;
};

const ProgramList: React.FC<ProgramListProps> = (props) => {
  const { program, onProgramChange } = props;

  const columns: ProColumns<API.Program>[] = [
    {
      title: 'programs',
      key: 'name',
      dataIndex: 'name',
      ellipsis: true,
    },
  ];

  return (
    <ProTable<API.Program>
      bordered
      dataSource={loginUserProgList}
      columns={columns}
      headerTitle="Hi"
      rowKey="id"
      defaultSize="small"
      rowClassName={(record) => {
        return record.id === program.id ? styles['split-row-select-active'] : '';
      }}
      options={false}
      pagination={false}
      search={false}
      onRow={(record) => {
        return {
          onClick: () => {
            if (record) {
              onProgramChange(record);
            }
          },
        };
      }}
    />
  );
};

export default ProgramList;
