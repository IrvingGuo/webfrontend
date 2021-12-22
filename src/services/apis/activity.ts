// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**  ---------ACTIVITY--------- */
export async function saveActivity(activity: API.Activity, options?: { [key: string]: any }) {
  return request<API.Result>('/api/activity', {
    method: 'POST',
    data: activity,
    ...(options || {}),
  });
}

export async function getAllActivities(options?: { [key: string]: any }) {
  return request<API.Result>('/api/activity', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function deleteActivity(activityId: number, options?: { [key: string]: any }) {
  return request<API.Result>('/api/activity/' + activityId, {
    method: 'DELETE',
    ...(options || {}),
  });
}
