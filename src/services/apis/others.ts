// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**  ---------DOWNLOAD RESOURCE PLAN EXCEL--------- */
export async function getMasterResPlanExcelFilename(options?: { [key: string]: any }) {
  return request<API.Result>('/api/assignment/excel', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function downloadFile(filename: string, options?: { [key: string]: any }) {
  return request('/api/download/' + filename, {
    method: 'GET',
    responseType: 'blob',
    ...(options || {}),
  });
}
