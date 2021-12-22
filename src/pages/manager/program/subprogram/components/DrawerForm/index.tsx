import { deleteSubprogram, saveSubprogram } from '@/services/apis/subprogram';
import { Button, Col, Drawer, Form, Input, message, Popconfirm, Row, Switch } from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useEffect } from 'react';

type DrawerFormProps = {
  visible: boolean;
  onVisibleClose: () => void;

  subprogram: API.Subprogram;
  onUpdateSubprogramList: (prog: API.Subprogram) => void;
  onDeleteSubprogramList: (progId: number) => void;
};

const DrawerForm: React.FC<DrawerFormProps> = (props) => {
  const { visible, onVisibleClose, subprogram, onUpdateSubprogramList, onDeleteSubprogramList } =
    props;

  const [form] = useForm();

  useEffect(() => {
    form.setFieldsValue({
      name: subprogram.name,
      status: subprogram.status,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subprogram]);

  const handleSubmit = async (values: any) => {
    try {
      const newSubprogram: API.Subprogram = {
        id: subprogram.id,
        name: values.name,
        status: values.status,
      };
      const msg = await saveSubprogram(newSubprogram);
      if (msg.success) {
        // save to local
        message.success('submit successfully');
        onUpdateSubprogramList(msg.data);
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
    if (!subprogram.id) {
      return;
    }
    return deleteSubprogram(subprogram.id)
      .then(({ success, errorMessage }) => {
        if (success) {
          message.success(subprogram.name + ' deleted');
          onDeleteSubprogramList(subprogram.id);
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
      title="Create / Update / Delete"
      width={420}
      onClose={onVisibleClose}
      visible={visible}
      bodyStyle={{ paddingBottom: 80 }}
    >
      <Form layout="vertical" hideRequiredMark onFinish={handleSubmit} form={form}>
        <Row gutter={32}>
          <Col span={16}>
            <Form.Item
              name="name"
              label="name"
              rules={[{ required: true, message: 'Please enter subprogram name' }]}
            >
              <Input style={{ width: '100%' }} placeholder="Please enter subprogram name" />
            </Form.Item>
          </Col>
          <Col span={8}>
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
          <Col span={6}>
            <Form.Item>
              <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
                Submit
              </Button>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Button onClick={onVisibleClose} style={{ width: '100%' }}>
              Cancel
            </Button>
          </Col>
          {subprogram.id != 0 && (
            <Col offset={6} span={6}>
              <Popconfirm
                placement="leftTop"
                title="Are you sure to delete this subprogram?"
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
