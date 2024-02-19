import { formatApiErrorMessage } from "../../utils/formatUtils";

describe("formatUtils", () => {
  describe("formatApiErrorMessage", () => {
    const defaultMessage = "Test Default Error Message";

    it("should append api error status and message if both provided", () => {
      const errorStatus = 500;
      const errorMessage = "Test Server Error Message";
      expect(
        formatApiErrorMessage(defaultMessage, errorStatus, errorMessage)
      ).toBe(`${defaultMessage}: ${errorMessage} [${errorStatus}]`);
    });

    it("should append api error status if only status is provided", () => {
      const errorStatus = 500;
      expect(
        formatApiErrorMessage(defaultMessage, errorStatus, undefined)
      ).toBe(`${defaultMessage} [${errorStatus}]`);
    });

    it("should append api error message if only message is provided", () => {
      const errorMessage = "Test Server Error Message";
      expect(
        formatApiErrorMessage(defaultMessage, undefined, errorMessage)
      ).toBe(`${defaultMessage}: ${errorMessage}`);
    });

    it("should just return the default message if nothing is provided", () => {
      expect(formatApiErrorMessage(defaultMessage, undefined, undefined)).toBe(
        defaultMessage
      );
    });
  });
});
