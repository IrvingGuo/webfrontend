import { saveDepartment } from '@/services/apis/department';
import { Button, Cascader, Col, Drawer, Form, Input, message, Row, Select } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';
import { getCascaderLevel } from './utils/utils';
import type { DataNode } from 'rc-cascader/lib/interface';

type DrawerFormProps = {
  visible: boolean;
  onVisibleClose: () => void;

  userSelectList: DataNode[];

  deptCascaderList: DataNode[];

  dept: API.Department;
  onUpdateOriDeptList: (dept: API.Department) => void;
};

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const { visible, onVisibleClose, userSelectList, deptCascaderList, dept, onUpdateOriDeptList } =
    props;

  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: dept.name,
      userId: dept.userId,
      parentDeptList: getCascaderLevel(dept.level),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dept]);

  const handleSubmit = async (values: any) => {
    try {
      const parentLevel = values.parentDeptList[values.parentDeptList.length - 1];
      const department: API.Department = {
        id: dept.id,
        name: values.name,
        userId: values.userId,
        level: parentLevel,
        parentId: parseInt(parentLevel.split('.').slice(-1)[0]),
      };
      const msg = await saveDepartment(department);
      if (msg.success) {
        // save to local
        message.success('submit successfully');
        onUpdateOriDeptList(msg.data);
      } else {
        message.error(msg.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      onVisibleClose();
    }
  };

  return (
    <Drawer
      title="Create / Update"
      width={480}
      onClose={onVisibleClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form layout="vertical" hideRequiredMark onFinish={handleSubmit} form={form}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="name"
              rules={[{ required: true, message: 'Please enter name' }]}
            >
              <Input style={{ width: '100%' }} placeholder="Please enter name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="userId"
              label="leader"
              rules={[{ required: true, message: 'Please select an user' }]}
            >
              <Select
                showSearch
                options={userSelectList}
                placeholder="Please select an owner"
                optionFilterProp="children"
                filterOption={(input, option: any) => {
                  return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
                }}
                filterSort={(optionA: any, optionB: any) => {
                  return optionA.label?.toLowerCase().localeCompare(optionB.label?.toLowerCase());
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="parentDeptList"
              label="parent department"
              rules={[{ required: true, message: 'Please select an parent department' }]}
            >
              <Cascader
                options={deptCascaderList}
                changeOnSelect
                placeholder="Please select an parent department"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={3}>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col span={3} offset={2}>
            <Button onClick={onVisibleClose}>Cancel</Button>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
