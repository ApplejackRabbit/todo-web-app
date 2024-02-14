import React, { useCallback, useState } from "react";
import { Button, Flex, Form, Input, Typography } from "antd";

const { Title } = Typography;

interface Props {
  onAddTodo?: (name: string) => Promise<void>;
}

interface FormValues {
  name: string;
}

const AddTodoForm: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const { onAddTodo } = props;

  const [isLoading, setLoading] = useState<boolean>(false);

  const onFinish = useCallback(
    async (values: FormValues) => {
      const { name } = values;
      if (onAddTodo) {
        setLoading(true);
        try {
          await onAddTodo(name);
          form.resetFields();
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    },
    [onAddTodo]
  );

  return (
    <Flex vertical gap="small">
      <Title level={5}>Add a To-Do</Title>
      <Form form={form} name="add-todo" layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Name must not be empty!",
              transform: (value: string | undefined) => value?.trim(),
            },
          ]}
        >
          <Input disabled={isLoading} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Add
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default AddTodoForm;
