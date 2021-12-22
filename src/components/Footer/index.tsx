import { useIntl } from 'umi';
import { DefaultFooter } from '@ant-design/pro-layout';
import { BackendIcon, FrontendIcon } from '@/pages/icon';

export default () => {
  const intl = useIntl();
  const defaultMessage = intl.formatMessage({
    id: 'app.copyright.produced',
    defaultMessage: '均联智行技术部出品',
  });

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: 'frontend',
          title: <FrontendIcon />,
          href: 'http://cnninvmgtlb01.joynext.com/chen_r1/resource-plan-improvement-frontend.git',
          blankTarget: true,
        },
        {
          key: 'backend',
          title: <BackendIcon />,
          href: 'http://cnninvmgtlb01.joynext.com/chen_r1/resource-plan-improvement.git',
          blankTarget: true,
        },
      ]}
    />
  );
};
