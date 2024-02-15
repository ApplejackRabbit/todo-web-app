import React, { useCallback, useEffect, useState } from "react";
import { Button, Flex, List, message, Modal, Typography } from "antd";
import AddTodoForm from "./AddTodoForm";
import EditTodoModal from "./EditTodoModal";
import type TodoItemType from "../types/TodoItemType";

const { Title } = Typography;

const containerStyle: React.CSSProperties = {
  paddingLeft: "20%",
  paddingRight: "20%",
};

const fakeData: TodoItemType[] = [
  { id: "0", name: "lorem" },
  { id: "1", name: "ipsum" },
  { id: "2", name: "dolor" },
  { id: "3", name: "sit" },
  { id: "4", name: "amet" },
];

const HomePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [todoData, setTodoData] = useState<TodoItemType[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  const showSuccessMessage = (content: string) => {
    messageApi.open({
      type: "success",
      content,
    });
  };

  const showErrorMessage = (content: string) => {
    messageApi.open({
      type: "error",
      content,
    });
  };

  const handleAddTodo = useCallback(async (name: string) => {
    // Simulate calling API to add a To-Do
    try {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
      });
      showSuccessMessage(`"${name}" is added successfully`);
    } catch (error) {
      showErrorMessage(`Error encountered when adding "${name}"`);
      throw error;
    }
  }, []);

  const handleEdit = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  const handleDelete = useCallback(() => {
    Modal.confirm({
      title: "Are you sure you want to delete this To-Do?",
      okButtonProps: { danger: true },
      okText: "Delete",
      onOk: async () => {
        // Delete the To-Do item
      },
    });
  }, []);

  const handleEditModalCancel = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  useEffect(() => {
    setTodoData(fakeData);
  }, []);

  return (
    <>
      {contextHolder}
      <Flex style={containerStyle} vertical gap="middle">
        <Title>To-Do</Title>
        <AddTodoForm onAddTodo={handleAddTodo} />
        <List
          bordered
          itemLayout="horizontal"
          dataSource={todoData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button onClick={handleEdit}>Edit</Button>,
                <Button danger onClick={handleDelete}>
                  Delete
                </Button>,
              ]}
            >
              <List.Item.Meta title={<Title level={5}>{item.name}</Title>} />
            </List.Item>
          )}
        />
      </Flex>
      <EditTodoModal open={isEditModalOpen} onCancel={handleEditModalCancel} />
    </>
  );
};

export default HomePage;
