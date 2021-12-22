import { getLeaderAssignments } from '@/services/apis/assignment';
import { getDepartmentsUnderLoginUser } from '@/services/apis/department';
import { getAllPrograms } from '@/services/apis/program';
import { getSubordinates } from '@/services/apis/user';
import { getProgValueEnum, getProgSelectList } from '@/utils/entity-adapter.utils';
import { getList } from '@/utils/utils';

export const defaultSuborList: API.User[] = await getList(getSubordinates);
export const loginUserDeptList: API.Department[] = await getList(getDepartmentsUnderLoginUser);

export const allPrograms: API.Program[] = await getList(getAllPrograms);
export const progValueEnum = getProgValueEnum(allPrograms);
export const progSelectList = getProgSelectList(allPrograms);

export const defaultAssignmentList: API.Assignment[] = await getList(getLeaderAssignments);
