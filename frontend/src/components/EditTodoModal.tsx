import React, { useCallback, useState } from "react";
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

  const [isLoading, setLoading] = useState<boolean>(false);

  const handleOk = useCallback(() => {
    form.submit();
  }, []);

  const onFinish = useCallback(
    async (values: FormValues) => {
      const { name } = values;
      if (defaultItem && onEditTodo) {
        try {
          setLoading(true);
          await onEditTodo(defaultItem, name);
        } catch (error) {
        } finally {
          setLoading(false);
        }
      }
    },
    [defaultItem, onEditTodo]
  );

  const modalExtraProps = {
    ...(defaultItem && { title: `Edit "${defaultItem.name}"` }),
  };
  const formItemExtraProps = {
    ...(defaultItem && { initialValue: defaultItem.name }),
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Edit"
      okButtonProps={{ loading: isLoading }}
      destroyOnClose
      {...modalExtraProps}
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
          <Input disabled={isLoading} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditTodoModal;
