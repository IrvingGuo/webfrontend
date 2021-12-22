import ProgramOverview from '@/components/ProgramOverview';
import ProCard from '@ant-design/pro-card';
import styles from '@/pages/styles.less';
import { allPrograms, defaultAssignmentList } from '../../../share';

const ResPlanProgramOverview: React.FC = () => {
  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <ProgramOverview programList={allPrograms} assignmentList={defaultAssignmentList} />
    </ProCard>
  );
};

export default ResPlanProgramOverview;
