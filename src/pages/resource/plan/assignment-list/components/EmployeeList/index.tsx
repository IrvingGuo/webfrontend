import { defaultSuborList, loginUserDeptList } from '@/pages/resource/share';
import { DownOutlined } from '@ant-design/icons';
import { TreeSelect } from 'antd';
import { LeaderIcon } from '@/pages/icon';
import { filterDeptLevel } from '@/utils/utils';
import { UserOutlined } from '@ant-design/icons';
import type { DataNode } from 'rc-tree-select/lib/interface';

function convertToTreeData(deptList: API.Department[], userList: API.User[]) {
  const treeData: DataNode[] = [];
  if (userList.length == 0) {
    return treeData;
  }
  const userSet = new Set(); // to avoid leaf with the same keys since one people can lead multiple departments
  const { divisions, departments, groups } = filterDeptLevel(deptList);
  divisions.forEach((division) => {
    // add new division
    const newDivision: DataNode = {
      title: division.name,
      key: division.level + '.' + division.id,
      value: division.level + '.' + division.id,
      selectable: false,
      children: [],
    };
    // add division leader as the first item in child array
    const divisionLeader = userList.find((user) => user.id == division.userId);
    if (divisionLeader && !userSet.has(divisionLeader.id)) {
      newDivision.children?.push({
        title: divisionLeader.cn,
        key: divisionLeader.id ? divisionLeader.id : -1,
        value: divisionLeader.id ? divisionLeader.id : -1,
        icon: <LeaderIcon />,
        isLeaf: true,
      });
      userSet.add(divisionLeader.id);
    }
    treeData.push(newDivision);
  });

  departments.forEach((department) => {
    const foundDivision = treeData.find((division) => division.key == department.level);
    if (foundDivision) {
      // add new department
      const newDepartment: DataNode = {
        title: department.name,
        key: department.level + '.' + department.id,
        value: department.level + '.' + department.id,
        selectable: false,
        children: [],
      };
      // add department leader as the first item in child array
      const departmentLeader = userList.find((user) => user.id == department.userId);
      if (departmentLeader && !userSet.has(departmentLeader.id)) {
        newDepartment.children?.push({
          title: departmentLeader.cn,
          key: departmentLeader.id ? departmentLeader.id : -1,
          value: departmentLeader.id ? departmentLeader.id : -1,
          icon: <LeaderIcon />,
        });
        userSet.add(departmentLeader.id);
      }
      foundDivision.children?.push(newDepartment);
    }
  });

  groups.forEach((group) => {
    const levels = group.level?.split('.');
    const foundDivision = treeData.find(
      (division) => division.key == levels?.slice(0, 2).join('.'),
    );
    if (foundDivision) {
      const foundDepartment = foundDivision.children?.find(
        (department) => department.key == group.level,
      );
      if (foundDepartment) {
        // add new department
        const newGroup: DataNode = {
          title: group.name,
          key: group.level + '.' + group.id,
          value: group.level + '.' + group.id,
          selectable: false,
          children: [],
        };
        // add group leader as the first item in child array
        const groupLeader = userList.find((user) => user.id == group.userId);
        if (groupLeader && !userSet.has(groupLeader.id)) {
          newGroup.children?.push({
            title: groupLeader.cn,
            key: groupLeader.id ? groupLeader.id : -1,
            value: groupLeader.id ? groupLeader.id : -1,
            icon: <LeaderIcon />,
          });
          userSet.add(groupLeader.id);
        }
        // add all other members
        userList.forEach((user) => {
          if (user.deptId == group.id && !userSet.has(user.id)) {
            newGroup.children?.push({
              title: user.cn,
              key: user.id ? user.id : -1,
              value: user.id ? user.id : -1,
              icon: <UserOutlined />,
            });
            userSet.add(user.id);
          }
        });
        foundDepartment.children?.push(newGroup);
      }
    }
  });
  return treeData;
}

type EmployeeListProps = {
  onSuborChange: (suborId: number) => void;
};

const EmployeeList: React.FC<EmployeeListProps> = (props) => {
  const { onSuborChange } = props;

  const onChange = (value: number) => {
    onSuborChange(value);
  };

  return (
    <TreeSelect
      showSearch
      treeIcon={true}
      style={{ width: 160 }}
      switcherIcon={<DownOutlined />}
      treeDefaultExpandAll
      dropdownMatchSelectWidth={false}
      onSelect={onChange}
      treeNodeFilterProp="title"
      placeholder="Choose a subordinate"
      treeData={convertToTreeData(loginUserDeptList, defaultSuborList)}
    />
  );
};

export default EmployeeList;
