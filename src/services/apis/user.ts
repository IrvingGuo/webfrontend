// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**  ---------USER--------- */
export async function createUser(user: API.User, options?: { [key: string]: any }) {
  return request<API.Result>('/api/user', {
    method: 'POST',
    data: user,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function updateUser(user: API.User, options?: { [key: string]: any }) {
  return request<API.Result>('/api/user', {
    method: 'PUT',
    data: user,
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function deleteUser(userId: number, options?: { [key: string]: any }) {
  return request<API.Result>('/api/user/' + userId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取User领导的部门下的员工
 * UserId通过JWT形式传给后端
 */
export async function getSubordinates(options?: { [key: string]: any }) {
  return request<API.Result>('/api/user/subor', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getAllUsers(options?: { [key: string]: any }) {
  return request<API.Result>('/api/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 通过JWT获取当前的用户信息
 */
export async function queryCurrentUser(options?: { [key: string]: any }) {
  return request<API.Result>('/api/user/current', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.Result>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
