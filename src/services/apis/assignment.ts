// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/**  ---------ASSIGNMENT--------- */
/** 获取Leader所有Assignments */
export async function getLeaderAssignments(options?: { [key: string]: any }) {
  return request<API.Result>('/api/assignment/leader', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

/** 获取Tpm所有Assignments */
export async function getTpmAssignments(options?: { [key: string]: any }) {
  return request<API.Result>('/api/assignment/tpm', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function getAssignmentsByProgramId(
  programId: number,
  options?: { [key: string]: any },
) {
  return request<API.Result>('/api/assignment/program/' + programId, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    ...(options || {}),
  });
}

export async function createAssignments(
  assignments: API.Assignment[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/api/assignment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: assignments,
    ...(options || {}),
  });
}

export async function updateAssignments(
  assignments: API.Assignment[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/api/assignment', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: assignments,
    ...(options || {}),
  });
}

export async function updateAssignmentsStatus(
  assignments: API.AssignmentStatusPayload[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/api/assignment/status', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: assignments,
    ...(options || {}),
  });
}

export async function deleteAssignments(
  assignments: API.Assignment[],
  options?: { [key: string]: any },
) {
  return request<API.Result>('/api/assignment', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    data: assignments,
    ...(options || {}),
  });
}
