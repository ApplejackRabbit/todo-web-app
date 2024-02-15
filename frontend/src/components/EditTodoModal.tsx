import React, { useCallback } from "react";
import { Form, Input, Modal } from "antd";
import type { ModalProps } from "antd";
import type TodoItemType from "../types/TodoItemType";

interface Props {
  open?: ModalProps["open"];
  onCancel?: ModalProps["onCancel"];
  defaultItem?: TodoItemType | null;
  onEditTodo?: (oldItem: TodoItemType, newName: string) => Promise<void>;
}

interface FormValues {
  name: string;
}

const EditTodoModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const { open, onCancel, defaultItem, onEditTodo } = props;

  const handleOk = useCallback(() => {
    form.submit();
  }, []);

  const onFinish = useCallback(
    async (values: FormValues) => {
      const { name } = values;
      if (defaultItem && onEditTodo) {
        try {
          await onEditTodo(defaultItem, name);
        } catch (error) {
        } finally {
        }
      }
    },
    [defaultItem, onEditTodo]
  );

  const formItemExtraProps = {
    ...(defaultItem && { initialValue: defaultItem.name }),
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title="Edit To-Do"
      okText="Edit"
      destroyOnClose
    >
      <Form
        form={form}
        name="edit-todo"
        layout="vertical"
        preserve={false}
        onFinish={onFinish}
      >
        <Form.Item
          name="name"
          label="Name"
          required={false}
          rules={[
            {
              required: true,
              message: "Name must not be empty!",
              transform: (value: string | undefined) => value?.trim(),
            },
          ]}
          {...formItemExtraProps}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTodoModal;
