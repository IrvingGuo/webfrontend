import { getAllActivities } from '@/services/apis/activity';
import { getProgramsUnderLoginUser } from '@/services/apis/program';
import { getAllSubprograms } from '@/services/apis/subprogram';
import { getList } from '@/utils/utils';

export const loginUserProgList = await getList(getProgramsUnderLoginUser);
export const subprogramList = await getList(getAllSubprograms);
export const activityList = await getList(getAllActivities);
