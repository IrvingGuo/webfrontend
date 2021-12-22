import { getAllDepartments } from '@/services/apis/department';
import { getAllPrograms } from '@/services/apis/program';
import { getAllUsers } from '@/services/apis/user';
import { getList } from '../../utils/utils';

export const defaultDeptList: API.Department[] = await getList(getAllDepartments);
export const defaultUserList: API.User[] = await getList(getAllUsers);
export const defaultProgList: API.Program[] = await getList(getAllPrograms);
