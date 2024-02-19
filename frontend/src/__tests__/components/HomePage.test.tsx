import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import HomePage from "../../components/HomePage";
import fakeTodoData from "../../fake-data/fakeTodo";
import testRequestHandlers from "../../utils/testRequestHandlers";

describe("HomePage", () => {
  const server = setupServer(...testRequestHandlers);

  beforeAll(() => server.listen());

  afterEach(() => server.resetHandlers());

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
      expect(screen.getByText(`Edit "${firstItem.name}"`)).toBeInTheDocument();
    });
  });

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
        screen.getByText(`Are you sure you want to delete "${firstItem.name}"?`)
      ).toBeInTheDocument();
    });
  });
});
