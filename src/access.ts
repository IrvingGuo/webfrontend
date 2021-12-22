/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
import { PRIV_MANAGER, PRIV_RES, PRIV_TPM } from './utils/constants';

export default function access(initialState: { user?: API.User | undefined }) {
  const { user } = initialState || {};
  if (!user || !user?.privilege) {
    return {
      canAdmin: false,
      canRes: false,
      canTpm: false,
    };
  }
  return {
    canManager: (user.privilege & PRIV_MANAGER) > 0,
    canRes: (user.privilege & PRIV_RES) > 0,
    canTpm: (user.privilege & PRIV_TPM) > 0,
  };
}
