// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**  ---------DEPARTMENT--------- */
/**
 * 获取User负责的Programs
 * UserId通过JWT形式传给后端
 */
export async function saveDepartment(dept: API.Department, options?: { [key: string]: any }) {
  return request<API.Result>('/api/department', {
    method: 'POST',
    data: dept,
    ...(options || {}),
  });
}

export async function getDepartmentsUnderLoginUser(options?: { [key: string]: any }) {
  return request<API.Result>('/api/department/user', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
export async function getAllDepartments(options?: { [key: string]: any }) {
  return request<API.Result>('/api/department', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
