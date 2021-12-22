import type { ColumnFilterItem } from 'antd/lib/table/interface';
import type { DataNode } from 'rc-cascader/lib/interface';
import { filterDates } from '@/utils/date-columns.utils';
import { getProperStatus } from '@/utils/utils';

// dept
export function getDeptValueEnum(deptList: API.Department[]) {
  const deptColSelectList = new Map();
  deptList.forEach((dept) =>
    deptColSelectList.set(dept.id, {
      text: dept.name,
    }),
  );
  return deptColSelectList;
}

export function getDeptFilterList(deptList: API.Department[]) {
  const deptFilterList: ColumnFilterItem[] = [];
  deptList.forEach((dept) => {
    if (dept.name) {
      deptFilterList.push({
        text: dept.name,
        value: dept.id ? dept.id : -1,
      });
    }
  });
  return deptFilterList;
}

// user
export function getUserValueEnum(userList: API.User[]) {
  const userColSelectList = new Map();
  userList.forEach((user) =>
    userColSelectList.set(user.id, {
      text: user.cn,
    }),
  );
  return userColSelectList;
}

export function getUserFilterList(userList: API.User[]) {
  const suborFilterList: ColumnFilterItem[] = [];
  userList.forEach((subor) => {
    if (subor.cn) {
      suborFilterList.push({
        text: subor.cn,
        value: subor.id ? subor.id : -1,
      });
    }
  });
  return suborFilterList;
}

export function getUserSelectList(userList: API.User[]) {
  const formSelectUserList: DataNode[] = [];
  userList.forEach((user: API.User) => {
    formSelectUserList.push({
      value: user.id ? user.id : -1,
      label: user.cn ? user.cn : '',
    });
  });
  return formSelectUserList;
}

// program
export function getProgValueEnum(progList: API.Program[]) {
  const valueEnum = new Map();
  progList.forEach((program: API.Program) =>
    valueEnum.set(program.id, {
      text: program.name,
    }),
  );
  return valueEnum;
}

export function getProgFilterList(progList: API.Program[]) {
  const progFilterList: ColumnFilterItem[] = [];
  progList.forEach((subor) => {
    if (subor.name) {
      progFilterList.push({
        text: subor.name,
        value: subor.id,
      });
    }
  });
  return progFilterList;
}

export const getProgSelectList = (progList: API.Program[]) => {
  const progSelectOptions: DataNode[] = [];
  progList.forEach((program: API.Program) =>
    progSelectOptions.push({
      value: program.id,
      label: program.name,
    }),
  );
  return progSelectOptions;
};

// subprogram
export function getSubprogramValueEnum(subprogramList: API.Subprogram[]) {
  const valueEnum = new Map();
  subprogramList.forEach((subprogram: API.Subprogram) =>
    valueEnum.set(subprogram.id, {
      text: subprogram.name,
    }),
  );
  return valueEnum;
}

export function getSubprogramFilterList(subprogramList: API.Subprogram[]) {
  const subprogramFilterList: ColumnFilterItem[] = [];
  subprogramList.forEach((subor) => {
    if (subor.name) {
      subprogramFilterList.push({
        text: subor.name,
        value: subor.id,
      });
    }
  });
  return subprogramFilterList;
}

export const getSubprogramSelectList = (subprogramList: API.Subprogram[]) => {
  const subprogramSelectOptions: DataNode[] = [];
  subprogramList.forEach((subprogram: API.Subprogram) => {
    if (subprogram.status && subprogram.status == true) {
      subprogramSelectOptions.push({
        value: subprogram.id,
        label: subprogram.name,
      });
    }
  });
  return subprogramSelectOptions;
};

// activity
export function getActivityValueEnum(activityList: API.Activity[]) {
  const valueEnum = new Map();
  activityList.forEach((activity: API.Activity) =>
    valueEnum.set(activity.id, {
      text: activity.name,
    }),
  );
  return valueEnum;
}

export function getActivityFilterList(activityList: API.Activity[]) {
  const activityFilterList: ColumnFilterItem[] = [];
  activityList.forEach((activity) => {
    if (activity.name) {
      activityFilterList.push({
        text: activity.name,
        value: activity.id,
      });
    }
  });
  return activityFilterList;
}

export const getActivitySelectList = (activityList: API.Activity[]) => {
  const activitySelectOptions: DataNode[] = [];
  activityList.forEach((activity: API.Activity) => {
    if (activity && activity.status == true) {
      activitySelectOptions.push({
        value: activity.id,
        label: activity.name,
      });
    }
  });
  return activitySelectOptions;
};

// assignment
export function convertAssignmentsToResPlanDSByUserId(
  assignments: API.Assignment[],
  userId: number,
) {
  const records: Record<string, any>[] = [];
  const progIdxMap = new Map();
  // get assignments belong to userId
  const userAssignments = assignments.filter((assignment) => assignment.userId == userId);
  // group assignments by program
  userAssignments.forEach((assignment, idx) => {
    const programId = assignment.programId;
    if (!progIdxMap.has(programId)) {
      records.push({
        programId: programId,
        key: (Date.now() + idx).toString(),
        userId: userId,
      });
      progIdxMap.set(programId, records.length - 1);
    }
    const record = records[progIdxMap.get(programId)];
    record[assignment.allocationTime] = assignment.allocation;
    record[assignment.allocationTime + 'id'] = assignment.id;
    record.status |= assignment.status;
  });
  // reset proper status
  records.forEach((record) => (record.status = getProperStatus(record.status)));
  return records;
}

export function convertAssignmentsToResPlanDS(
  assignments: API.Assignment[],
  suborList: API.User[],
) {
  let key = 0;
  const records: Record<string, any>[] = [];
  suborList.forEach((subor) => {
    const ds = convertAssignmentsToResPlanDSByUserId(assignments, subor.id ? subor.id : -1, key);
    records.push(...ds);
    key = ds.length + key + 1;
  });
  return records;
}

export function convertResPlanDSToAssignmentList(
  records: Record<string, any>[],
  userId: number,
  deptId: number,
) {
  const assignmentList: API.Assignment[] = [];
  for (let i = 0; i < records.length; i++) {
    const dates = filterDates(records[i]);
    dates.forEach((date: string) => {
      assignmentList.push({
        id: records[i][date + 'id'],
        userId: userId,
        programId: records[i].programId,
        deptId: deptId,
        status: records[i].status,
        allocation: records[i][date],
        allocationTime: date,
      });
    });
  }
  return assignmentList;
}

export function convertAssignmentsToProgramDS(assignments: API.Assignment[]) {
  let key = 0;
  const records: Record<string, any>[] = [];
  const progIdxMap = new Map();
  assignments.forEach((assignment) => {
    const programId = assignment.programId;
    if (!progIdxMap.has(programId)) {
      records.push({
        programId: programId,
        key: ++key,
      });
      progIdxMap.set(programId, records.length - 1);
    }
    const record = records[progIdxMap.get(programId)];
    if (!record[assignment.allocationTime]) {
      record[assignment.allocationTime] = 0;
    }
    if (!record.total) {
      record.total = 0;
    }
    if (assignment.allocation) {
      record[assignment.allocationTime] += assignment.allocation;
      record.total += assignment.allocation;
    }
  });
  records.forEach((record) => {
    const dates = filterDates(record);
    dates.forEach((date) => {
      record[date] = Number(Number(record[date]).toFixed(1));
    });
    record.total = Number(Number(record.total).toFixed(1));
  });
  return records;
}

export function convertAssignmentsToUserDS(assignments: API.Assignment[]) {
  let key = 0;
  const records: Record<string, any>[] = [];
  const userIdxMap = new Map();
  assignments.forEach((assignment) => {
    const userId = assignment.userId;
    if (!userIdxMap.has(userId)) {
      records.push({
        userId: userId,
        key: ++key,
      });
      userIdxMap.set(userId, records.length - 1);
    }
    const record = records[userIdxMap.get(userId)];
    if (!record[assignment.allocationTime]) {
      record[assignment.allocationTime] = 0;
    }
    if (!record.total) {
      record.total = 0;
    }
    if (assignment.allocation) {
      record[assignment.allocationTime] += assignment.allocation;
      record.total += assignment.allocation;
    }
  });
  records.forEach((record) => {
    const dates = filterDates(record);
    dates.forEach((date) => {
      record[date] = Number(Number(record[date]).toFixed(1));
    });
    record.total = Number(Number(record.total).toFixed(1));
  });
  return records;
}
