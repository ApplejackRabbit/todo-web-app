export const formatApiErrorMessage = (
  defaultMessage: string,
  errorStatus: number | undefined,
  errorMessage: string | undefined
): string => {
  let result = defaultMessage;
  if (errorMessage) {
    result = result.concat(": ", errorMessage);
  }
  if (errorStatus) {
    result = result.concat(" ", `[${errorStatus}]`);
  }
  return result;
};
