import React, { useCallback, useEffect, useState } from "react";
import { Button, Flex, List, message, Modal, Skeleton, Typography } from "antd";
import AddTodoForm from "./AddTodoForm";
import EditTodoModal from "./EditTodoModal";
import type TodoItemType from "../types/TodoItemType";

const { Title } = Typography;

const skeletonCount = 5;

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
  const [isLoading, setLoading] = useState<boolean>(false);

  const [itemToEdit, setItemToEdit] = useState<TodoItemType | null>(null);

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

  const openEditModal = useCallback((item: TodoItemType) => {
    setItemToEdit(item);
  }, []);

  const closeEditModal = useCallback(() => {
    setItemToEdit(null);
  }, []);

  const handleEditTodo = useCallback(
    async (oldItem: TodoItemType, newName: string) => {
      const { name: oldName } = oldItem;
      // Simulate calling API to edit a To-Do
      try {
        await new Promise((resolve, reject) => {
          setTimeout(resolve, 1000);
        });
        closeEditModal();
        showSuccessMessage(
          `"${oldName}" is changed to "${newName}" successfully`
        );
      } catch (error) {
        showErrorMessage(
          `Error encountered when changing "${oldName}" to "${newName}"`
        );
        throw error;
      }
    },
    [closeEditModal]
  );

  const handleDeleteTodo = useCallback(async (item: TodoItemType) => {
    const { name } = item;
    // Simulate calling API to delete a To-Do
    try {
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 1000);
      });
      showSuccessMessage(`"${name}" is deleted successfully`);
    } catch (error) {
      showErrorMessage(`Error encountered when deleting "${name}"`);
      throw error;
    }
  }, []);

  const prepareDelete = useCallback(
    (item: TodoItemType) => {
      Modal.confirm({
        title: `Are you sure you want to delete "${item.name}"?`,
        okButtonProps: { danger: true },
        okText: "Delete",
        onOk: async () => {
          try {
            await handleDeleteTodo(item);
          } catch (error) {}
        },
      });
    },
    [handleDeleteTodo]
  );

  const reloadData = async () => {
    // Simulate calling API to fetch all To-Dos
    setLoading(true);
    try {
      const data = await new Promise<TodoItemType[]>((resolve, reject) => {
        setTimeout(() => {
          resolve(fakeData);
        }, 1000);
      });
      setTodoData(data);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const makeDummyData = (): TodoItemType[] =>
    Array(skeletonCount)
      .fill(null)
      .map((_, i) => ({ id: `${i}`, name: "" }));

  const makeListItemElement = (item: TodoItemType) => (
    <List.Item
      actions={[
        <Button onClick={() => openEditModal(item)}>Edit</Button>,
        <Button danger onClick={() => prepareDelete(item)}>
          Delete
        </Button>,
      ]}
    >
      <List.Item.Meta title={item.name} />
    </List.Item>
  );

  const makeSkeletonElement = () => (
    <List.Item>
      <Skeleton title paragraph={false} loading active />
    </List.Item>
  );

  return (
    <>
      {contextHolder}
      <Flex style={containerStyle} vertical gap="middle">
        <Title>To-Do</Title>
        <AddTodoForm onAddTodo={handleAddTodo} />
        <List
          bordered
          itemLayout="horizontal"
          dataSource={isLoading ? makeDummyData() : todoData}
          renderItem={isLoading ? makeSkeletonElement : makeListItemElement}
        />
      </Flex>
      <EditTodoModal
        open={!!itemToEdit}
        onCancel={closeEditModal}
        defaultItem={itemToEdit}
        onEditTodo={handleEditTodo}
      />
    </>
  );
};

export default HomePage;
