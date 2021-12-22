import { ASSIGNMENT_PENDING } from '@/utils/constants';
import { filterDates } from '@/utils/date-columns.utils';
import type { ProColumns } from '@ant-design/pro-table';
import { notification } from 'antd';
import type { DataNode } from 'rc-cascader/lib/interface';

export function compareDS(
  ori: Record<string, any>[],
  cur: Record<string, any>[],
  suborId: number,
  deptId: number,
) {
  const oriRecordMap = convertRecordsToMapWithprogId(ori);
  const curRecordMap = convertRecordsToMapWithprogId(cur);
  const [oriHas, curHas, bothHave] = getCommonDiffSet(
    [...oriRecordMap.keys()],
    [...curRecordMap.keys()],
  );

  const createItems: API.Assignment[] = [];
  const modifyItems: API.Assignment[] = [];
  const deleteItems: API.Assignment[] = [];

  // delete a row
  oriHas.forEach((progId) => {
    const records = oriRecordMap.get(progId);
    records?.forEach((record) => {
      const dates = filterDates(record);
      dates.forEach((date) => {
        deleteItems.push({
          id: record[date + 'id'],
          userId: suborId,
          programId: progId,
          deptId: deptId,
          allocation: record[date],
          allocationTime: date,
          status: ASSIGNMENT_PENDING,
        });
      });
    });
  });

  // create a row
  curHas.forEach((progId) => {
    const records = curRecordMap.get(progId);
    records?.forEach((record) => {
      const dates = filterDates(record);
      dates.forEach((date) => {
        if (record[date] == 0 || record[date] == null) {
          return;
        }
        createItems.push({
          userId: suborId,
          programId: progId,
          deptId: deptId,
          allocation: record[date],
          allocationTime: date,
          status: ASSIGNMENT_PENDING,
        });
      });
    });
  });

  // same program id, compare date
  bothHave.forEach((progId) => {
    const oriRecords = oriRecordMap.get(progId);
    const curRecords = curRecordMap.get(progId);
    if (!oriRecords || !curRecords) {
      console.warn('oriRecords or curRecords are undefined');
      return;
    }
    for (let i = 0; i < oriRecords?.length; i++) {
      const oriRecord = oriRecords[i];
      const curRecord = curRecords[i];
      const oriDates: string[] = filterDates(oriRecord);
      const curDates: string[] = filterDates(curRecord);
      const [oriRecordHas, curRecordHas, bothRecordHave] = getCommonDiffSet(oriDates, curDates);
      // delete a date
      for (let j = 0; j < oriRecordHas.length; j++) {
        const date = oriRecordHas[j];
        deleteItems.push({
          id: oriRecord[date + 'id'],
          userId: suborId,
          programId: progId,
          deptId: deptId,
          allocation: oriRecord[date],
          allocationTime: date,
          status: ASSIGNMENT_PENDING,
        });
      }
      // create a date
      for (let j = 0; j < curRecordHas.length; j++) {
        const date = curRecordHas[j];
        if (curRecord[date] == 0 || curRecord[date] == null) {
          return;
        }
        createItems.push({
          userId: suborId,
          programId: progId,
          deptId: deptId,
          allocation: curRecord[date],
          allocationTime: date,
          status: ASSIGNMENT_PENDING,
        });
      }
      // judge if hour in this date is modified
      for (let j = 0; j < bothRecordHave.length; j++) {
        const date = bothRecordHave[j];
        if (oriRecord[date] != curRecord[date]) {
          if (curRecord[date] == null || curRecord[date] == 0) {
            deleteItems.push({
              id: oriRecord[date + 'id'],
              userId: suborId,
              programId: progId,
              deptId: deptId,
              allocation: oriRecord[date],
              allocationTime: date,
              status: ASSIGNMENT_PENDING,
            });
          } else {
            modifyItems.push({
              id: oriRecord[date + 'id'],
              userId: suborId,
              programId: progId,
              deptId: deptId,
              allocation: curRecord[date],
              allocationTime: date,
              status: ASSIGNMENT_PENDING,
            });
          }
        }
      }
    }
  });

  console.log('create', createItems);
  console.log('modify', modifyItems);
  console.log('delete', deleteItems);
  return [createItems, modifyItems, deleteItems];
}

// all records must have key 'programId'
// map records with the same 'programId' together
function convertRecordsToMapWithprogId(records: Record<string, any>[]) {
  const map: Map<number, Record<string, any>[]> = new Map();
  records.forEach((record) => {
    const progId = record.programId;
    if (!map.has(progId)) {
      map.set(progId, []);
    }
    const recordArr = map.get(progId);
    recordArr?.push(record);
  });
  return map;
}

// get different set and common set from two number arrays
function getCommonDiffSet(ori: any[], cur: any[]) {
  const bothHave = ori.filter((progId) => cur.includes(progId));
  const oriHas = ori.filter((progId) => !bothHave.includes(progId));
  const curHas = cur.filter((progId) => !bothHave.includes(progId));
  return [oriHas, curHas, bothHave];
}

// check if sum for each month is 0 or 1
export const validateManMonth = (
  records: Record<string, any>[],
  dateCols: ProColumns<Record<string, any>>[],
): boolean => {
  if (records.length == 0) return true;
  const validateMap = new Map();
  records.forEach((record) => {
    const dates = filterDates(record);
    dates.forEach((date) => {
      if (!validateMap.has(date)) {
        validateMap.set(date, 0);
      }
      if (record[date]) {
        validateMap.set(date, validateMap.get(date) + record[date]);
      }
    });
  });
  const errTotalDates = [];
  const notFilledDates = [];
  for (const dateCol of dateCols) {
    const date = dateCol.dataIndex;
    if (validateMap.has(date)) {
      const total = validateMap.get(date).toFixed(1);
      if (total == 0) {
        notFilledDates.push(dateCol.title);
      } else if (total != 1) {
        errTotalDates.push('[' + dateCol.title + ': ' + total + ']');
      }
    } else {
      notFilledDates.push(dateCol.title);
    }
  }
  if (errTotalDates.length != 0) {
    notification.error({
      message: 'Man-hour total must be 0 or 1',
      description: errTotalDates.join(', '),
      duration: 10,
    });
    return false;
  }
  if (notFilledDates.length != 0) {
    notification.error({
      message: 'All months must be filled',
      description: notFilledDates.join(', '),
      duration: 10,
    });
    return false;
  }
  return true;
};

// check if there are dup programs selected
export const validateProgram = (
  records: Record<string, any>[],
  progSelectOptions: DataNode[],
): boolean => {
  const progSet = new Set();
  for (const [idx, record] of records.entries()) {
    const programId = record.programId;
    if (!programId || programId == 0) {
      notification.error({
        message: 'All rows must have a program',
        description: 'row: ' + (idx + 1),
        duration: 10,
      });
      return false;
    }
    if (progSet.has(programId)) {
      const option = progSelectOptions.find((selectOptions) => selectOptions.value == programId);
      notification.error({
        message: 'Duplicate programs selected!',
        description: '[' + option?.label + ']',
        duration: 10,
      });
      return false;
    }
    progSet.add(programId);
  }
  return true;
};

export function pruneDS(
  records: Record<string, any>[],
  dateCols: ProColumns<Record<string, any>>[],
) {
  const dateSet = new Set();
  dateCols.forEach((dateCol) => dateSet.add(dateCol.dataIndex));
  const prunedDS: Record<string, any>[] = [...records];
  prunedDS.forEach((record) => {
    const filteredDates: string[] = filterDates(record);
    filteredDates.forEach((date) => {
      if (!dateSet.has(date) || !record[date]) {
        delete record[date];
      }
    });
  });
  return prunedDS;
}
