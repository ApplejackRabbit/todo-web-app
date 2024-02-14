import React from "react";
import { Form, Input, Modal } from "antd";
import type { ModalProps } from "antd";

interface Props {
  open?: ModalProps["open"];
  onCancel?: ModalProps["onCancel"];
}

const EditTodoModal: React.FC<Props> = (props) => {
  const { open, onCancel } = props;
  return (
    <Modal open={open} onCancel={onCancel} title="Edit To-Do" okText="Edit">
      <Form name="edit-todo" layout="vertical">
        <Form.Item name="name" label="Name">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTodoModal;
