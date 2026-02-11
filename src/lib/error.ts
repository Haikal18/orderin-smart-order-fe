/**
 * Type definitions for API responses and errors
 */

import { AxiosError } from 'axios';

/**
 * Standard API Error Response
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Type guard untuk Axios Error
 */
export function isAxiosError(error: unknown): error is AxiosError<ApiErrorResponse> {
  return (error as AxiosError).isAxiosError === true;
}

/**
 * Helper untuk mengambil error message dari Axios Error
 */
export function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (isAxiosError(error)) {
    return error.response?.data?.message || defaultMessage;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return defaultMessage;
}
