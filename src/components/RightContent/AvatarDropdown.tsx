import React, { useCallback } from 'react';
import { BugOutlined, DownloadOutlined, LogoutOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, message, notification, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { removeToken } from '@/utils/auth';
import { PRIV_MANAGER, PRIV_RES, PRIV_TPM } from '@/utils/constants';
import { downloadFile, getMasterResPlanExcelFilename } from '@/services/apis/others';

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = () => {
  removeToken();
  const { query = {}, pathname } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/login' && !redirect) {
    history.replace({
      pathname: '/login',
      search: stringify({
        redirect: pathname,
      }),
    });
  }
};

const AvatarDropdown: React.FC = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onHandleDownload = async () => {
    try {
      const msg = await getMasterResPlanExcelFilename();
      if (msg.success) {
        const filename = msg.data;
        const blob = await downloadFile(filename);
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([blob], { type: 'application/vnd.ms-excel' }));
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      } else {
        console.log(msg.errorMessage);
        message.error(msg.errorMessage);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, user: undefined }));
        loginOut();
      } else if (key === 'report') {
        notification.info({
          message:
            'If you find a bug, please dingding Chen ruonan or email to ruonan.chen@joynext.com. Thank you!',
          duration: 10,
        });
      } else if (key === 'export') {
        onHandleDownload();
      }
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { user } = initialState;

  if (!user) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {user?.privilege && (user?.privilege & (PRIV_MANAGER | PRIV_RES | PRIV_TPM)) > 0 && (
        <Menu.Item key="export">
          <DownloadOutlined />
          export res plan
        </Menu.Item>
      )}
      <Menu.Item key="report">
        <BugOutlined />
        report bugs
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        logout
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} alt="avatar" icon={<UserOutlined />} />
        <span className={`${styles.name} anticon`}>{user.cn}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
