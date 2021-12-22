import { deleteProgram, saveProgram } from '@/services/apis/program';
import {
  Button,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  message,
  Popconfirm,
  Row,
  Select,
  Switch,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect } from 'react';
import type { DataNode } from 'rc-cascader/lib/interface';
import { getActivitySelectList, getSubprogramSelectList } from '@/utils/entity-adapter.utils';

type DrawerFormProps = {
  visible: boolean;
  onVisibleClose: () => void;

  prog: API.Program;
  onUpdateProgList: (prog: API.Program) => void;
  onDeleteProgList: (progId: number) => void;

  subprogramList: API.Subprogram[];
  activityList: API.Activity[];

  userSelectList: DataNode[];
};

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const {
    visible,
    onVisibleClose,
    prog,
    onUpdateProgList,
    onDeleteProgList,
    subprogramList,
    activityList,
    userSelectList,
  } = props;

  const typeSelectOptions = [
    {
      value: 'Non-Program',
      label: 'Non-Program',
    },
    {
      value: 'Awarded Program',
      label: 'Awarded Program',
    },
    {
      value: 'Expected Program',
      label: 'Expected Program',
    },
    {
      value: 'Internal Program',
      label: 'Internal Program',
    },
  ];

  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: prog.name,
      userId: prog.userId,
      type: prog.type,
      closeDate: moment(prog.closeDate),
      status: prog.status,
      subprograms: prog.subprograms ? prog.subprograms.split(',').map(Number) : undefined,
      activities: prog.activities ? prog.activities.split(',').map(Number) : undefined,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prog]);

  const handleSubmit = async (values: any) => {
    try {
      const newProg: API.Program = {
        id: prog.id,
        name: values.name,
        userId: values.userId,
        type: values.type,
        closeDate: values.closeDate.format(),
        status: values.status,
        subprograms: values.subprograms ? values.subprograms.sort().join(',') : undefined,
        activities: values.activities ? values.activities.sort().join(',') : undefined,
      };
      const msg = await saveProgram(newProg);
      if (msg.success) {
        // save to local
        message.success('submit successfully');
        onUpdateProgList(msg.data);
      } else {
        message.error(msg.errorMessage);
      }
    } catch (error) {
      console.log(error);
    } finally {
      onVisibleClose();
    }
  };

  const onDeleteConfirm = () => {
    if (!prog.id) {
      return;
    }
    return deleteProgram(prog.id)
      .then(({ success, errorMessage }) => {
        if (success) {
          message.success(prog.name + ' deleted');
          onDeleteProgList(prog.id ? prog.id : -1);
        } else {
          message.error(errorMessage);
        }
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        onVisibleClose();
      });
  };

  return (
    <Drawer
      title="Create / Update"
      width={720}
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
              label="tpm"
              rules={[{ required: true, message: 'Please enter tpm' }]}
            >
              <Select
                showSearch
                options={userSelectList}
                placeholder="Please select tpm"
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
          <Col span={12}>
            <Form.Item
              name="type"
              label="type"
              rules={[{ required: true, message: 'Please enter type' }]}
            >
              <Select options={typeSelectOptions} placeholder="Please enter type" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="closeDate"
              label="close date"
              rules={[{ required: false, message: 'Please enter close date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name="status"
              label="status"
              valuePropName="checked"
              rules={[{ required: true, message: 'Please enter status' }]}
            >
              <Switch
                checkedChildren="enabled"
                unCheckedChildren="disabled"
                defaultChecked={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="subprograms"
              label="Subprograms"
              rules={[{ required: false, message: 'Please enter subprograms' }]}
            >
              <Select
                mode="multiple"
                options={getSubprogramSelectList(subprogramList)}
                placeholder="Please enter subprograms"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              name="activities"
              label="Activities"
              rules={[{ required: false, message: 'Please enter activities' }]}
            >
              <Select
                mode="multiple"
                options={getActivitySelectList(activityList)}
                placeholder="Please enter activities"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={4}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col span={4}>
            <Button onClick={onVisibleClose} style={{ width: '100%' }}>
              Cancel
            </Button>
          </Col>
          {prog.id != 0 && (
            <Col offset={12} span={4}>
              <Popconfirm
                placement="leftTop"
                title="Are you sure to delete this user? All relative assignments will be deleted as well."
                onConfirm={onDeleteConfirm}
                okText="Yes"
                cancelText="No"
              >
                <Button type="default" danger style={{ width: '100%' }}>
                  Delete
                </Button>
              </Popconfirm>
            </Col>
          )}
        </Row>
      </Form>
    </Drawer>
  );
};

export default DrawerForm;
