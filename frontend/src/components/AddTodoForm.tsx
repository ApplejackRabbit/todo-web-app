import React from "react";
import { Button, Flex, Form, Input, Typography } from "antd";

const { Title } = Typography;

const AddTodoForm: React.FC = () => {
  return (
    <Flex vertical gap="small">
      <Title level={5}>Add a To-Do</Title>
      <Form name="add-todo" layout="vertical">
        <Form.Item name="name" label="Name">
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
