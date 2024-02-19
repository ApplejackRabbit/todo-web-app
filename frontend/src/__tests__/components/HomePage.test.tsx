import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import HomePage from "../../components/HomePage";
import fakeTodoData from "../../fake-data/fakeTodo";
import { handlers, resetData } from "../../utils/testRequestHandlers";

describe("HomePage", () => {
  const server = setupServer(...handlers);

  beforeAll(() => server.listen());

  afterEach(() => {
    server.resetHandlers();
    resetData();

    // Manually remove any modals added by 'antd'
    // https://stackoverflow.com/a/68232655
    const modals = document.querySelectorAll(".ant-modal-wrap");
    modals.forEach((modal) => modal.parentNode?.removeChild(modal));
  });

  afterAll(() => server.close());

  it("renders correctly", async () => {
    render(<HomePage />);
    expect(screen.getByText("To-Do")).toBeInTheDocument();

    await waitFor(() => {
      fakeTodoData.forEach((item) => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
      expect(screen.getAllByRole("button", { name: "Edit" }).length).toBe(
        fakeTodoData.length
      );
      expect(screen.getAllByRole("button", { name: "Delete" }).length).toBe(
        fakeTodoData.length
      );
    });
  });

  describe("Add To-Do", () => {
    it("should be able to add a To-Do", async () => {
      const todoName = "Test Add";

      render(<HomePage />);

      act(() => {
        userEvent.type(screen.getByLabelText("Name"), todoName);
        userEvent.click(screen.getByRole("button", { name: "Add" }));
      });

      await waitFor(() => {
        expect(
          screen.getByText(`"${todoName}" is added successfully`)
        ).toBeInTheDocument();
        expect(screen.getByText(todoName)).toBeInTheDocument();
      });
    });
  });

  describe("Update To-Do", () => {
    it("should open modal when edit button is clicked", async () => {
      const firstItem = fakeTodoData[0];

      render(<HomePage />);

      const editButtons = await screen.findAllByRole("button", {
        name: "Edit",
      });
      act(() => {
        userEvent.click(editButtons[0]);
      });
      await waitFor(() => {
        expect(
          screen.getByText(`Edit "${firstItem.name}"`)
        ).toBeInTheDocument();
      });
    });

    it("should be able to update a To-Do", async () => {
      const firstItem = fakeTodoData[0];
      const newTodoName = "Test Update";

      render(<HomePage />);

      const editButtons = await screen.findAllByRole("button", {
        name: "Edit",
      });
      act(() => {
        userEvent.click(editButtons[0]);
      });

      const modal = await screen.findByRole("dialog");
      const modalEditInput = within(modal).getByLabelText("Name");
      const modalEditConfirmButton = within(modal).getByRole("button", {
        name: "Edit",
      });
      act(() => {
        userEvent.clear(modalEditInput);
        userEvent.type(modalEditInput, newTodoName);
        userEvent.click(modalEditConfirmButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(
            `"${firstItem.name}" is changed to "${newTodoName}" successfully`
          )
        ).toBeInTheDocument();
        expect(screen.getByText(newTodoName)).toBeInTheDocument();
      });
    });
  });

  describe("Delete To-Do", () => {
    it("should open modal when delete button is clicked", async () => {
      const firstItem = fakeTodoData[0];

      render(<HomePage />);

      const deleteButtons = await screen.findAllByRole("button", {
        name: "Delete",
      });
      act(() => {
        userEvent.click(deleteButtons[0]);
      });
      await waitFor(() => {
        expect(
          screen.getByText(
            `Are you sure you want to delete "${firstItem.name}"?`
          )
        ).toBeInTheDocument();
      });
    });

    it("should be able to delete a To-Do", async () => {
      const firstItem = fakeTodoData[0];

      render(<HomePage />);

      const deleteButtons = await screen.findAllByRole("button", {
        name: "Delete",
      });
      act(() => {
        userEvent.click(deleteButtons[0]);
      });

      const modal = await screen.findByRole("dialog");
      const modalDeleteConfirmButton = within(modal).getByRole("button", {
        name: "Delete",
      });
      act(() => {
        userEvent.click(modalDeleteConfirmButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText(`"${firstItem.name}" is deleted successfully`)
        ).toBeInTheDocument();
        expect(screen.queryByText(firstItem.name)).toBeNull();
      });
    });
  });
});
