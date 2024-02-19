import { isAxiosError } from "axios";

type ErrorBody = { message: string };
type ErrorInfo = { status?: number } & Partial<ErrorBody>;

export const getApiErrorInfo = (error: any): ErrorInfo | undefined => {
  if (isAxiosError<ErrorBody>(error)) {
    const { status, data } = { ...error.response };
    const { message } = { ...data };
    return { status, message };
  }
  return undefined;
};
