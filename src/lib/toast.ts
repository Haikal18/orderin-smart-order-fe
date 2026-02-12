import { toast as sonnerToast } from 'sonner';
import { AxiosError } from 'axios';


interface ApiErrorResponse {
  status: string;
  message: string;
  errors?: Record<string, string[]>;
}


interface ApiSuccessResponse {
  status: string;
  message: string;
  data?: unknown;
}


export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const response = error.response?.data as ApiErrorResponse;
    

    if (response?.message) {
      return response.message;
    }
    

    if (response?.errors) {
      const firstError = Object.values(response.errors)[0];
      if (firstError && firstError.length > 0) {
        return firstError[0];
      }
    }
    
  
    return error.message || 'Terjadi kesalahan';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Terjadi kesalahan';
};


export const extractSuccessMessage = (response: ApiSuccessResponse): string => {
  return response?.message || 'Berhasil';
};


export const showSuccessToast = (message: string | ApiSuccessResponse) => {
  const msg = typeof message === 'string' ? message : extractSuccessMessage(message);
  sonnerToast.success(msg);
};


export const showErrorToast = (error: unknown) => {
  const msg = extractErrorMessage(error);
  sonnerToast.error(msg);
};


export const showLoadingToast = (message: string) => {
  return sonnerToast.loading(message);
};


export const showInfoToast = (message: string) => {
  sonnerToast.info(message);
};


export const dismissToast = (id: string | number) => {
  sonnerToast.dismiss(id);
};


export const useToast = () => {
  return {
    success: showSuccessToast,
    error: showErrorToast,
    loading: showLoadingToast,
    info: showInfoToast,
    dismiss: dismissToast,
  };
};
