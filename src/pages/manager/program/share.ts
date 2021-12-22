import { getAllActivities } from '@/services/apis/activity';
import { getAllSubprograms } from '@/services/apis/subprogram';
import { getList } from '@/utils/utils';

export const defaultSubprogramList: API.Subprogram[] = await getList(getAllSubprograms);
export const defaultActivityList: API.Activity[] = await getList(getAllActivities);
