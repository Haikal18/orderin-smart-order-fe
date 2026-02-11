import { toast as sonnerToast } from 'sonner';

export const toast = (options: {
    title?: string;
    description?: string;
    variant?: 'default' | 'destructive';
}) => {
    if (options.variant === 'destructive') {
        console.error(options.title, options.description);
    } else {
        console.log(options.title, options.description);
    }
};

export const useToast = () => {
    return { toast };
};
