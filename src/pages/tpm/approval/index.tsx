import { useState } from 'react';
import ProCard from '@ant-design/pro-card';
import ProgramList from './components/ProgramList';
import AssignmentList from './components/AssignmentList';
import styles from '@/pages/styles.less';
import { PageContainer } from '@ant-design/pro-layout';
import { Space } from 'antd';
import { ProjectOutlined } from '@ant-design/icons';

const content = (
  <Space>
    <ProjectOutlined />
    Review and approve resource plans for your projects
  </Space>
);

const Demo: React.FC = () => {
  const [program, setProgram] = useState<API.Program>({ id: -1, name: 'Hi' });
  return (
    <PageContainer content={content}>
      <ProCard split="vertical" gutter={24} ghost>
        <ProCard colSpan="20%" className={styles['card-shadow-radius-border']}>
          <ProgramList program={program} onProgramChange={(cSubor) => setProgram(cSubor)} />
        </ProCard>
        <ProCard colSpan="80%" className={styles['card-shadow-radius-border']}>
          <AssignmentList program={program} />
        </ProCard>
      </ProCard>
    </PageContainer>
  );
};

export default Demo;
