import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import EditTodoModal from "../../components/EditTodoModal";
import type TodoItemType from "../../types/TodoItemType";

describe("EditTodoModal", () => {
  const todoItem: TodoItemType = { id: "0", name: "lorem" };
  const inputErrorMessage = "Name must not be empty!";

  it("renders correctly", () => {
    render(<EditTodoModal open defaultItem={todoItem} />);
    expect(screen.getByText(`Edit "${todoItem.name}"`)).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toHaveValue(todoItem.name);
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument();
  });

  it("open/close status should be controlled by the 'open' prop", () => {
    const { rerender } = render(<EditTodoModal defaultItem={todoItem} />);
    expect(screen.queryByText(`Edit "${todoItem.name}"`)).toBeNull();

    rerender(<EditTodoModal open defaultItem={todoItem} />);
    expect(screen.getByText(`Edit "${todoItem.name}"`)).toBeInTheDocument();

    rerender(<EditTodoModal open={false} defaultItem={todoItem} />);
    expect(screen.queryByText(`Edit "${todoItem.name}"`)).toBeNull();
  });

  it("should invoke 'onCancel' prop when modal is being cancelled", async () => {
    const onCancel = jest.fn();
    render(<EditTodoModal open defaultItem={todoItem} onCancel={onCancel} />);
    act(() => {
      userEvent.click(screen.getByRole("button", { name: "Cancel" }));
    });
    await waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  it("should validate unsuccessfully for empty input", async () => {
    const onEditTodo = jest.fn();
    render(
      <EditTodoModal open defaultItem={todoItem} onEditTodo={onEditTodo} />
    );
    act(() => {
      userEvent.clear(screen.getByLabelText("Name"));
      userEvent.click(screen.getByRole("button", { name: "Edit" }));
    });
    await waitFor(() => {
      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();
      expect(onEditTodo).not.toHaveBeenCalled();
    });
  });

  it("should validate unsuccessfully for input containing only spaces", async () => {
    const onEditTodo = jest.fn();
    render(
      <EditTodoModal open defaultItem={todoItem} onEditTodo={onEditTodo} />
    );
    act(() => {
      userEvent.clear(screen.getByLabelText("Name"));
      userEvent.type(screen.getByLabelText("Name"), " ");
      userEvent.click(screen.getByRole("button", { name: "Edit" }));
    });
    await waitFor(() => {
      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();
      expect(onEditTodo).not.toHaveBeenCalled();
    });
  });

  it("should validate successfully and invoke callback for non-empty, non-space-only input", async () => {
    const inputText = "Test Input";
    const onEditTodo = jest.fn();
    render(
      <EditTodoModal open defaultItem={todoItem} onEditTodo={onEditTodo} />
    );
    act(() => {
      userEvent.clear(screen.getByLabelText("Name"));
      userEvent.type(screen.getByLabelText("Name"), inputText);
      userEvent.click(screen.getByRole("button", { name: "Edit" }));
    });
    await waitFor(() => {
      expect(screen.queryByText(inputErrorMessage)).toBeNull();
      expect(onEditTodo).toHaveBeenNthCalledWith(1, todoItem, inputText);
    });
  });
});
