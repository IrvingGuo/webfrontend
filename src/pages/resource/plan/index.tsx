import { ExcelIcon } from '@/pages/icon';
import { PageContainer } from '@ant-design/pro-layout';
import { Space } from 'antd';
import { history } from 'umi';

const content = (
  <Space>
    <ExcelIcon />
    Estimate Man-month for your group
  </Space>
);

type ResPlanProps = {
  match: {
    url: string;
    path: string;
  };
  location: {
    pathname: string;
  };
};

const tabList = [
  {
    key: 'assignment',
    tab: 'Planner',
  },
  {
    key: 'user-overview',
    tab: 'User Overview',
  },
  {
    key: 'program-overview',
    tab: 'Program Overview',
  },
  {
    key: 'total-overview',
    tab: 'Total Overview',
  },
];

const ResPlan: React.FC<ResPlanProps> = (props) => {
  const handleTabChange = (key: string) => {
    const { match } = props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'assignment':
        history.push(`${url}/assignment`);
        break;
      case 'user-overview':
        history.push(`${url}/user-overview`);
        break;
      case 'program-overview':
        history.push(`${url}/program-overview`);
        break;
      case 'total-overview':
        history.push(`${url}/total-overview`);
        break;
      default:
        break;
    }
  };

  const getTabKey = () => {
    const { match, location } = props;
    const url = match.path === '/' ? '' : match.path;
    const tabKey = location.pathname.replace(`${url}/`, '');
    if (tabKey && tabKey !== '/') {
      return tabKey;
    }
    return 'assignment';
  };

  return (
    <PageContainer
      content={content}
      tabList={tabList}
      tabActiveKey={getTabKey()}
      onTabChange={handleTabChange}
    >
      {props.children}
    </PageContainer>
  );
};

export default ResPlan;
