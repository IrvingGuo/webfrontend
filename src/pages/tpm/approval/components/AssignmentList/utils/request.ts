import type { ProSchemaValueEnumMap } from '@ant-design/pro-utils';
import type { ProSchemaValueEnumType } from '@ant-design/pro-provider';
import { getAssignmentsByProgramId, updateAssignmentsStatus } from '@/services/apis/assignment';
import moment from 'moment';
import { ASSIGNMENT_APPROVED, ASSIGNMENT_PENDING, ASSIGNMENT_REJECTED } from '@/utils/constants';
import { filterDates } from '@/utils/date-columns.utils';

export const onHandleGetAssignments = async (programId: number) => {
  const userValueEnum: ProSchemaValueEnumMap = new Map<React.ReactText, ProSchemaValueEnumType>();
  const ds: Record<string, any>[] = [];
  try {
    const result = await getAssignmentsByProgramId(programId);
    if (result.success) {
      if (result.data.length == 0) {
        return {
          ds: ds,
          dates: [moment(), moment()],
          userValueEnum: userValueEnum,
        };
      }
      const userAllocMap = new Map();
      result.data.forEach((assignment: API.Assignment) => {
        const userId = assignment.userId;
        const userCn = assignment.cn;
        userValueEnum.set(userId, { text: userCn });
        const allocTime = assignment.allocationTime;
        if (!userAllocMap.has(userId)) {
          userAllocMap.set(userId, new Map());
        }
        const allocTimeMap = userAllocMap.get(userId);
        allocTimeMap.set(allocTime, assignment);
      });
      let key = 0;
      let minDate = moment([9999, 0]).format();
      let maxDate = moment([1, 0]).format();
      for (const [userId, allocMap] of userAllocMap) {
        const obj: any = {
          userId: userId,
          key: key++,
        };
        let status = 0;
        for (const [allocationTime, assignment] of allocMap) {
          if (minDate > allocationTime) {
            minDate = allocationTime;
          }
          if (maxDate < allocationTime) {
            maxDate = allocationTime;
          }
          obj[allocationTime] = assignment.allocation;
          obj[allocationTime + 'id'] = assignment.id;
          status |= assignment.status;
        }
        // set status
        if ((status & ASSIGNMENT_REJECTED) > 0) {
          status = ASSIGNMENT_REJECTED;
        } else if ((status & ASSIGNMENT_PENDING) > 0) {
          status = ASSIGNMENT_PENDING;
        } else {
          status = ASSIGNMENT_APPROVED;
        }
        obj.status = status;
        ds.push(obj);
      }
      return {
        ds: ds,
        dates: [moment(minDate), moment(maxDate)],
        userValueEnum: userValueEnum,
      };
    } else {
      console.log(result.errorMessage);
      return {
        ds: ds,
        dates: [undefined, undefined],
        userValueEnum: userValueEnum,
      };
    }
  } catch (error) {
    console.error(error);
    return {
      ds: ds,
      dates: [undefined, undefined],
      userValueEnum: userValueEnum,
    };
  }
};

export const onHandleChangeStatus = async (record: Record<string, any>, status: number) => {
  // construct assignments
  const dates: string[] = filterDates(record);
  const items: API.AssignmentStatusPayload[] = [];
  dates.forEach((date) => {
    items.push({
      id: record[date + 'id'],
      status: status,
    });
  });
  // request
  const result = await updateAssignmentsStatus(items);
  if (!result.success) {
    console.log(result.errorMessage);
  }
};

export const onHandleChangeStatusInBatch = async (
  records: Record<string, any>[],
  status: number,
) => {
  // construct assignments
  const items: API.AssignmentStatusPayload[] = [];
  records.forEach((record) => {
    const dates: string[] = filterDates(record);
    dates.forEach((date) => {
      items.push({
        id: record[date + 'id'],
        status: status,
      });
    });
  });
  // request
  const result = await updateAssignmentsStatus(items);
  if (!result.success) {
    console.log(result.errorMessage);
  }
};
