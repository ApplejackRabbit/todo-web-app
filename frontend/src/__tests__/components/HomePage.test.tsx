import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import HomePage from "../../components/HomePage";

describe("HomePage", () => {
  it("should open modal when delete button is clicked", async () => {
    render(<HomePage />);
    const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
    act(() => {
      userEvent.click(deleteButtons[0]);
    });
    await waitFor(() => {
      expect(
        screen.getByText(`Are you sure you want to delete "lorem"?`)
      ).toBeInTheDocument();
    });
  });
});
