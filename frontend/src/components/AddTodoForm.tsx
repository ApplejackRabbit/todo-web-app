import React, { useCallback } from "react";
import { Button, Flex, Form, Input, Typography } from "antd";

const { Title } = Typography;

interface Props {
  onAddTodo?: (name: string) => Promise<void>;
}

interface FormValues {
  name: string;
}

const AddTodoForm: React.FC<Props> = (props) => {
  const { onAddTodo } = props;

  const onFinish = useCallback(
    (values: FormValues) => {
      const { name } = values;
      onAddTodo && onAddTodo(name);
    },
    [onAddTodo]
  );

  return (
    <Flex vertical gap="small">
      <Title level={5}>Add a To-Do</Title>
      <Form name="add-todo" layout="vertical" onFinish={onFinish}>
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
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add
          </Button>
        </Form.Item>
      </Form>
    </Flex>
  );
};

export default AddTodoForm;
