import ProCard from '@ant-design/pro-card';
import { defaultAssignmentList, defaultSuborList } from '../../../share';
import styles from '@/pages/styles.less';
import UserOverview from '@/components/UserOverview';

const ResPlanUserOverview: React.FC = () => {
  return (
    <ProCard className={styles['card-shadow-radius-border']}>
      <UserOverview userList={defaultSuborList} assignmentList={defaultAssignmentList} />
    </ProCard>
  );
};

export default ResPlanUserOverview;
