import React from "react";
import { Form, Input, Modal } from "antd";
import type { ModalProps } from "antd";
import type TodoItemType from "../types/TodoItemType";

interface Props {
  open?: ModalProps["open"];
  onCancel?: ModalProps["onCancel"];
  defaultItem?: TodoItemType | null;
}

const EditTodoModal: React.FC<Props> = (props) => {
  const [form] = Form.useForm();

  const { open, onCancel, defaultItem } = props;

  const formItemExtraProps = {
    ...(defaultItem && { initialValue: defaultItem.name }),
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="Edit To-Do"
      okText="Edit"
      destroyOnClose
    >
      <Form form={form} name="edit-todo" layout="vertical" preserve={false}>
        <Form.Item name="name" label="Name" {...formItemExtraProps}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTodoModal;
