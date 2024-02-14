import React, { useCallback, useEffect, useState } from "react";
import { Button, Flex, List, Typography } from "antd";
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
  const [todoData, setTodoData] = useState<TodoItemType[]>([]);
  const [isEditModalOpen, setEditModalOpen] = useState<boolean>(false);

  const handleEdit = useCallback(() => {
    setEditModalOpen(true);
  }, []);

  const handleEditModalCancel = useCallback(() => {
    setEditModalOpen(false);
  }, []);

  useEffect(() => {
    setTodoData(fakeData);
  }, []);

  return (
    <>
      <Flex style={containerStyle} vertical gap="middle">
        <Title>To-Do</Title>
        <AddTodoForm />
        <List
          bordered
          itemLayout="horizontal"
          dataSource={todoData}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button onClick={handleEdit}>Edit</Button>,
                <Button danger>Delete</Button>,
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
