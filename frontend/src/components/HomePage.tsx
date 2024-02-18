import React, { useCallback, useEffect, useState } from "react";
import { Button, Flex, List, message, Modal, Skeleton, Typography } from "antd";
import AddTodoForm from "./AddTodoForm";
import EditTodoModal from "./EditTodoModal";
import apiClient from "../network/apiClient";
import type TodoItemType from "../types/TodoItemType";

const { Title } = Typography;

const skeletonCount = 2;

const containerStyle: React.CSSProperties = {
  paddingLeft: "20%",
  paddingRight: "20%",
};

const HomePage: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();

  const [todoData, setTodoData] = useState<TodoItemType[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isInitialLoaded, setInitialLoaded] = useState<boolean>(false);

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

  const reloadData = async () => {
    setLoading(true);
    try {
      const { results } = await apiClient.listTodos();
      setTodoData(results);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = useCallback(async (name: string) => {
    try {
      await apiClient.createTodo(name);
      showSuccessMessage(`"${name}" is added successfully`);
      reloadData();
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
      const { id, name: oldName } = oldItem;
      try {
        await apiClient.updateTodo(id, newName);
        closeEditModal();
        showSuccessMessage(
          `"${oldName}" is changed to "${newName}" successfully`
        );
        reloadData();
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
    const { id, name } = item;
    try {
      await apiClient.deleteTodo(id);
      showSuccessMessage(`"${name}" is deleted successfully`);
      reloadData();
    } catch (error) {
      showErrorMessage(`Error encountered when deleting "${name}"`);
      throw error;
    }
  }, []);

  const openDeleteModal = useCallback(
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

  useEffect(() => {
    const initialLoad = async () => {
      await reloadData();
      setInitialLoaded(true);
    };
    initialLoad();
  }, []);

  const showSkeleton = isLoading || !isInitialLoaded;

  const makeDummyData = (): TodoItemType[] =>
    Array(skeletonCount)
      .fill(null)
      .map((_, i) => ({ id: `${i}`, name: "" }));

  const makeListItemElement = (item: TodoItemType) => (
    <List.Item
      actions={[
        <Button onClick={() => openEditModal(item)}>Edit</Button>,
        <Button danger onClick={() => openDeleteModal(item)}>
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
          dataSource={showSkeleton ? makeDummyData() : todoData}
          renderItem={showSkeleton ? makeSkeletonElement : makeListItemElement}
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
