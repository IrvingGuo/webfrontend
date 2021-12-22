// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**  ---------PROJECT--------- */
export async function saveProgram(prog: API.Program, options?: { [key: string]: any }) {
  return request<API.Result>('/api/program', {
    method: 'POST',
    data: prog,
    ...(options || {}),
  });
}

export async function deleteProgram(progId: number, options?: { [key: string]: any }) {
  return request<API.Result>('/api/program/' + progId, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/**
 * 获取User负责的Programs
 * UserId通过JWT形式传给后端
 */
export async function getProgramsUnderLoginUser(options?: { [key: string]: any }) {
  return request<API.Result>('/api/program/user/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getAllPrograms(options?: { [key: string]: any }) {
  return request<API.Result>('/api/program', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}
