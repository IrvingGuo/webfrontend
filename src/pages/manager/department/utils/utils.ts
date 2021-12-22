import { filterDeptLevel } from '@/utils/utils';
import type { DataNode } from 'rc-cascader/lib/interface';

export function genDeptCascaderList(divisions: API.Department[], departments: API.Department[]) {
  const deptCascaderList: DataNode[] = [];
  deptCascaderList.push({
    value: '0',
    label: 'None',
  });
  // first level
  divisions.forEach((division) => {
    deptCascaderList.push({
      value: division.level + '.' + division.id,
      label: division.name,
      children: [],
    });
  });
  // second level
  departments.forEach((department) => {
    deptCascaderList
      .find((division) => parseInt(division.value?.toString().split('.')[1]) == department.parentId)
      ?.children?.push({
        value: department.level + '.' + department.id,
        label: department.name,
      });
  });
  return deptCascaderList;
}

export function generateDeptList(
  divisions: API.Department[],
  departments: API.Department[],
  groups: API.Department[],
) {
  const deptList: API.Department[] = [];
  // first level
  deptList.push(...divisions);
  // second level
  departments.forEach((department) => {
    deptList.find((division) => division.id == department.parentId)?.children?.push(department);
  });
  // third level
  groups.forEach((group) => {
    const levelList = group.level?.split('.');
    if (!levelList) {
      return;
    }
    const foundDivision = deptList.find((division) => division.id == parseInt(levelList[1]));
    const foundDept = foundDivision?.children?.find((dept) => dept.id == parseInt(levelList[2]));
    foundDept?.children?.push(group);
  });
  return deptList;
}

export function getDeptList(rawDeptList: API.Department[]) {
  const deptList: API.Department[] = [];
  let key = 0;
  rawDeptList.forEach((o, i, a) => {
    a[i].key = key++;
    a[i].children = [];
  });
  const { divisions, departments, groups } = filterDeptLevel(rawDeptList);
  deptList.push(...generateDeptList(divisions, departments, groups));
  return deptList;
}

export function getDeptCascaderList(rawDeptList: API.Department[]) {
  const deptCascaderList: DataNode[] = [];
  const { divisions, departments } = filterDeptLevel(rawDeptList);
  deptCascaderList.push(...genDeptCascaderList(divisions, departments));
  return deptCascaderList;
}
