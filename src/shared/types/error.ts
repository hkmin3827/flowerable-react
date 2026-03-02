import { AxiosError } from "axios";

export interface ErrorResponseBody {
  message?: string;
  errors?: { message?: string }[];
  status?: number;
  code?: string;
}

export type AppAxiosError = AxiosError<ErrorResponseBody>;

export function isAppAxiosError(error: unknown): error is AppAxiosError {
  return error instanceof AxiosError && error.isAxiosError === true;
}

export interface LocationStateWithMessage {
  message?: string;
}
