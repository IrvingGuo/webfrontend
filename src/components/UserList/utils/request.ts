import { filterDeptLevel } from '@/utils/utils';
import type { DataNode } from 'rc-cascader/lib/interface';

export function genDeptCascaderList(
  divisions: API.Department[],
  departments: API.Department[],
  groups: API.Department[],
) {
  const deptCascaderList: DataNode[] = [];
  deptCascaderList.push({
    value: 0,
    label: 'None',
  });
  // first level
  divisions.forEach((division) => {
    deptCascaderList.push({
      value: division.id ? division.id : -1,
      label: division.name,
      children: [],
    });
  });
  // second level
  departments.forEach((department) => {
    deptCascaderList
      .find((division) => division.value == department.parentId)
      ?.children?.push({
        value: department.id ? department.id : -1,
        label: department.name,
        children: [],
      });
  });
  // third level
  groups.forEach((group) => {
    deptCascaderList.forEach((division) => {
      if (division.children) {
        division.children
          .find((dept) => dept.value == group.parentId)
          ?.children?.push({
            value: group.id ? group.id : -1,
            label: group.name,
          });
      } else {
        return;
      }
    });
  });
  return deptCascaderList;
}

export function getDeptCascaderList(deptList: API.Department[]) {
  const deptCascaderList: DataNode[] = [];
  const { divisions, departments, groups } = filterDeptLevel(deptList);
  deptCascaderList.push(...genDeptCascaderList(divisions, departments, groups));
  return deptCascaderList;
}
