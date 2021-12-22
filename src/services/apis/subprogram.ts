// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**  ---------SUBPROGRAM--------- */
export async function saveSubprogram(subprogram: API.Subprogram, options?: { [key: string]: any }) {
  return request<API.Result>('/api/subprogram', {
    method: 'POST',
    data: subprogram,
    ...(options || {}),
  });
}

export async function getAllSubprograms(options?: { [key: string]: any }) {
  return request<API.Result>('/api/subprogram', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteSubprogram(subprogramId: number, options?: { [key: string]: any }) {
  return request<API.Result>('/api/subprogram/' + subprogramId, {
    method: 'DELETE',
    ...(options || {}),
  });
}
