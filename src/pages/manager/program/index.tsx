import { ExcelIcon } from '@/pages/icon';
import { PageContainer } from '@ant-design/pro-layout';
import { Space } from 'antd';
import { history } from 'umi';

const content = (
  <Space>
    <ExcelIcon />
    Review and edit all programs, subprograms and activities
  </Space>
);

type ProgramProps = {
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
    key: 'program',
    tab: 'Program',
  },
  {
    key: 'subprogram',
    tab: 'Subprogram',
  },
  {
    key: 'activity',
    tab: 'Activity',
  },
];

const Program: React.FC<ProgramProps> = (props) => {
  const handleTabChange = (key: string) => {
    const { match } = props;
    const url = match.url === '/' ? '' : match.url;
    switch (key) {
      case 'program':
        history.push(`${url}/program`);
        break;
      case 'subprogram':
        history.push(`${url}/subprogram`);
        break;
      case 'activity':
        history.push(`${url}/activity`);
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
    return 'program';
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

export default Program;
