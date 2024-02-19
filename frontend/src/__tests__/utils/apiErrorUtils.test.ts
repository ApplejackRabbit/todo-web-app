import { AxiosError, AxiosHeaders } from "axios";
import { getApiErrorInfo } from "../../utils/apiErrorUtils";

type ErrorBody = { message: string };

describe("apiErrorUtils", () => {
  describe("getApiErrorInfo", () => {
    it("should return error info if the error is an AxiosError", () => {
      const apiErrorMessage = "Test Server Error Message";
      const apiErrorStatus = 500;
      const axiosError = new AxiosError<ErrorBody>(
        "ERROR_MESSAGE",
        "ERROR_CODE",
        undefined,
        {},
        {
          data: { message: apiErrorMessage },
          status: apiErrorStatus,
          statusText: "Test statusText",
          headers: {},
          config: { headers: new AxiosHeaders() },
        }
      );

      expect(getApiErrorInfo(axiosError)).toEqual({
        status: apiErrorStatus,
        message: apiErrorMessage,
      });
    });

    it("should return undefined if the error is not an AxiosError", () => {
      const error = new Error("Test Error");
      expect(getApiErrorInfo(error)).toBeUndefined();
    });
  });
});
