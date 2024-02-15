import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../../components/HomePage";
import fakeTodoData from "../../fake-data/fakeTodo";

describe("HomePage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("renders correctly", async () => {
    render(<HomePage />);
    expect(screen.getByText("To-Do")).toBeInTheDocument();
    jest.runAllTimers();

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

  it("should open modal when edit button is clicked", async () => {
    const firstItem = fakeTodoData[0];

    render(<HomePage />);
    jest.runAllTimers();

    const editButtons = await screen.findAllByRole("button", {
      name: "Edit",
    });
    act(() => {
      userEvent.click(editButtons[0]);
    });
    await waitFor(() => {
      expect(screen.getByText(`Edit "${firstItem.name}"`)).toBeInTheDocument();
    });
  });

  it("should open modal when delete button is clicked", async () => {
    const firstItem = fakeTodoData[0];

    render(<HomePage />);
    jest.runAllTimers();

    const deleteButtons = await screen.findAllByRole("button", {
      name: "Delete",
    });
    act(() => {
      userEvent.click(deleteButtons[0]);
    });
    await waitFor(() => {
      expect(
        screen.getByText(`Are you sure you want to delete "${firstItem.name}"?`)
      ).toBeInTheDocument();
    });
  });
});
