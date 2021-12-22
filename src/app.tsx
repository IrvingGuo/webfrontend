import type { Settings as LayoutSettings } from '@ant-design/pro-layout';
import { PageLoading } from '@ant-design/pro-layout';
import type { RequestConfig, RunTimeLayoutConfig } from 'umi';
import { history } from 'umi';
import { queryCurrentUser } from './services/apis/user';
import { getToken } from '@/utils/auth';
import type { RequestOptionsInit } from 'umi-request';
import RightContent from './components/RightContent';
import Footer from './components/Footer';
import moment from 'moment-timezone';
import { message } from 'antd';

const loginPath = '/login';
moment.tz.setDefault('GMT'); // for database
moment.locale('en');

export const initialStateConfig = {
  loading: <PageLoading />,
};

/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  user?: API.User;
}> {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      if (msg.success) {
        return msg.data;
      } else {
        message.error(msg.errorMessage);
      }
    } catch (error) {
      history.push(loginPath);
      console.log(error);
    }
    return undefined;
  };
  if (history.location.pathname !== loginPath) {
    const user = await fetchUserInfo();
    return {
      user: user,
      settings: {},
    };
  }
  return {
    settings: {},
  };
}

export const layout: RunTimeLayoutConfig = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    footerRender: () => <Footer />,
    onPageChange: () => {
      if (!initialState?.user && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};

const authHeaderInterceptor = (url: string, options: RequestOptionsInit) => {
  const authHeader = { Authorization: getToken() };
  return {
    url: `${url}`,
    options: { ...options, interceptors: true, headers: authHeader },
  };
};

export const request: RequestConfig = {
  requestInterceptors: [authHeaderInterceptor],
};
