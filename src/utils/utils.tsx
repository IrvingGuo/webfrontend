import { message } from 'antd';
import { ASSIGNMENT_APPROVED, ASSIGNMENT_PENDING, ASSIGNMENT_REJECTED } from './constants';

export async function getList(getFunc: (options?: Record<string, any>) => Promise<API.Result>) {
  try {
    const msg = await getFunc();
    if (msg.success) {
      return msg.data == null ? [] : msg.data;
    } else {
      console.error(msg.errorMessage);
      message.error(msg.errorMessage);
    }
  } catch {
    console.log('fail to get object list for func: ', getFunc.name);
    return [];
  }
}

export function filterDeptLevel(deptList: API.Department[]) {
  const divisions: API.Department[] = [];
  const departments: API.Department[] = [];
  const groups: API.Department[] = [];
  deptList.forEach((dept) => {
    const level = dept.level?.split('.').length;
    if (level == 1) {
      divisions.push(dept);
    } else if (level == 2) {
      departments.push(dept);
    } else if (level == 3) {
      groups.push(dept);
    } else {
      console.error('detect error department', dept);
    }
  });
  return { divisions, departments, groups };
}

export function getProperStatus(status: number) {
  if ((status & ASSIGNMENT_PENDING) > 0) {
    return ASSIGNMENT_PENDING;
  } else if ((status & ASSIGNMENT_REJECTED) > 0) {
    return ASSIGNMENT_REJECTED;
  } else {
    return ASSIGNMENT_APPROVED;
  }
}
