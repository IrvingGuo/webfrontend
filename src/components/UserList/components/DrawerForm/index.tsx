import { createUser, deleteUser, updateUser } from '@/services/apis/user';
import {
  Button,
  Cascader,
  Col,
  DatePicker,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import moment from 'moment';
import { useEffect } from 'react';
import type { DataNode } from 'rc-cascader/lib/interface';
import ColorTag from './ColorTag';
import { privNameMap, PRIV_MANAGER, PRIV_RES, PRIV_TPM } from '@/utils/constants';
import { convertIntToBinary } from '../../utils/utils';

type DrawerFormProps = {
  visible: boolean;
  onVisibleClose: () => void;

  user: API.User;
  userList: API.User[];
  onUpdateUserList: (user: API.User) => void;
  onDeleteUserList: (userId: number) => void;

  onSetDeptCascader: (dept: number) => number[];
  deptCascaderList: DataNode[];

  disablePrivilege: boolean;
};

const locationOptions = [
  {
    value: 'Ningbo',
    label: 'Ningbo',
  },
  {
    value: 'Shanghai',
    label: 'Shanghai',
  },
  {
    value: 'Dalian',
    label: 'Dalian',
  },
];

const resourceTypeOptions = [
  {
    value: 'internal',
    label: 'internal',
  },
  {
    value: 'external',
    label: 'external',
  },
];

export const privilegeTypeOptions = [
  {
    value: PRIV_MANAGER,
    label: privNameMap.get(PRIV_MANAGER),
  },
  {
    value: PRIV_RES,
    label: privNameMap.get(PRIV_RES),
  },
  {
    value: PRIV_TPM,
    label: privNameMap.get(PRIV_TPM),
  },
];

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const {
    visible,
    onVisibleClose,
    user,
    userList,
    onUpdateUserList,
    onDeleteUserList,
    deptCascaderList,
    onSetDeptCascader,
    disablePrivilege,
  } = props;

  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      cn: user.cn,
      title: user.title,
      deptId: onSetDeptCascader(user.deptId ? user.deptId : 0),
      sAMAccount: user.sAMAccount,
      entryDate: moment(user.entryDate),
      resignDate: moment(user.resignDate),
      location: user.location,
      resourceType: user.resourceType,
      privilege: convertIntToBinary(user.privilege),
      status: user.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSubmit = async (values: any) => {
    try {
      const deptId = values.deptId[values.deptId.length - 1];
      const privilege = values.privilege.reduce(
        (partial_sum: number, a: number) => partial_sum + a,
        0,
      );
      const reqUser: API.User = {
        id: user.id,

        cn: values.cn,
        title: values.title,
        deptId: deptId,
        sAMAccount: values.sAMAccount,
        entryDate: values.entryDate.format(),
        resignDate: values.resignDate.format(),
        location: values.location,
        resourceType: values.resourceType,
        privilege: privilege,
        status: values.status,
      };
      let msg: API.Result = {};
      console.log(reqUser);
      if (user.id == 0) {
        msg = await createUser(reqUser);
      } else {
        msg = await updateUser(reqUser);
      }
      if (msg.success) {
        // save to local
        message.success('submit successfully');
        onUpdateUserList(msg.data);
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
    if (!user.id) {
      return;
    }
    return deleteUser(user.id)
      .then(({ success, errorMessage }) => {
        if (success) {
          message.success(user.cn + ' deleted');
          onDeleteUserList(user.id ? user.id : -1);
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
              name="cn"
              label="name"
              rules={[
                { required: true, message: 'Please enter name' },
                () => ({
                  validator(_, value) {
                    if (
                      user.id == 0 &&
                      userList.find(
                        (innerUser) =>
                          innerUser.cn?.toLocaleLowerCase() == value.toLocaleLowerCase(),
                      )
                    ) {
                      return Promise.reject(
                        new Error(
                          'duplicated name detected, please add some random number to distinguish',
                        ),
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <Input style={{ width: '100%' }} placeholder="Please enter name" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="title"
              label="title"
              rules={[{ required: false, message: 'Please enter title' }]}
            >
              <Input style={{ width: '100%' }} placeholder="Please enter title" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="deptId"
              label="department"
              rules={[{ required: true, message: 'Please select department' }]}
            >
              <Cascader
                options={deptCascaderList}
                style={{ width: '100%' }}
                changeOnSelect
                placeholder="Please select department"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="location"
              label="location"
              rules={[{ required: false, message: 'Please enter location' }]}
            >
              <Select options={locationOptions} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="entryDate"
              label="entry date"
              rules={[{ required: false, message: 'Please enter entry date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="resignDate"
              label="resign date"
              rules={[{ required: false, message: 'Please enter resign date' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="resourceType"
              label="resource type"
              rules={[{ required: false, message: 'Please enter resource type' }]}
            >
              <Select options={resourceTypeOptions} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="privilege"
              label="privilege"
              rules={[{ required: false, message: 'Please enter privilege' }]}
            >
              <Select
                mode="multiple"
                showArrow
                style={{ width: '100%' }}
                tagRender={ColorTag}
                options={privilegeTypeOptions}
                disabled={disablePrivilege}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="sAMAccount"
              label="window account"
              rules={[{ required: false, message: 'Please enter windows account' }]}
            >
              <Input style={{ width: '100%' }} placeholder="Please enter windows account" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="status"
              rules={[{ required: false, message: 'Please enter status' }]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="Please enter status" />
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
          {user.id != 0 && (
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
