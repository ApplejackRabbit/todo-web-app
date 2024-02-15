import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AddTodoForm from "../components/AddTodoForm";

describe("AddTodoForm", () => {
  const inputErrorMessage = "Name must not be empty!";

  it("renders correctly", () => {
    render(<AddTodoForm />);
    expect(screen.getByText("Add a To-Do")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("should validate unsuccessfully for empty input", async () => {
    const onAddTodo = jest.fn();
    render(<AddTodoForm onAddTodo={onAddTodo} />);
    act(() => {
      userEvent.click(screen.getByRole("button", { name: "Add" }));
    });
    await waitFor(() => {
      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();
      expect(onAddTodo).not.toHaveBeenCalled();
    });
  });

  it("should validate unsuccessfully for input containing only spaces", async () => {
    const onAddTodo = jest.fn();
    render(<AddTodoForm onAddTodo={onAddTodo} />);
    act(() => {
      userEvent.type(screen.getByLabelText("Name"), " ");
      userEvent.click(screen.getByRole("button", { name: "Add" }));
    });
    await waitFor(() => {
      expect(screen.getByText(inputErrorMessage)).toBeInTheDocument();
      expect(onAddTodo).not.toHaveBeenCalled();
    });
  });

  it("should validate successfully and invoke callback for non-empty, non-space-only input", async () => {
    const inputText = "Test Input";
    const onAddTodo = jest.fn();
    render(<AddTodoForm onAddTodo={onAddTodo} />);
    act(() => {
      userEvent.type(screen.getByLabelText("Name"), inputText);
      userEvent.click(screen.getByRole("button", { name: "Add" }));
    });
    await waitFor(() => {
      expect(screen.queryByText(inputErrorMessage)).toBeNull();
      expect(onAddTodo).toHaveBeenNthCalledWith(1, inputText);
      expect(screen.getByLabelText("Name")).toHaveValue("");
    });
  });
});
