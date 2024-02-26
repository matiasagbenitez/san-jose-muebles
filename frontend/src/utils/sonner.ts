import { toast } from "sonner";

export class SonnerToast {

    static normal(message: string, options?: any) {
        toast(message, options);
    }

    static success(message: string, options?: any) {
        toast.success(message, options);
    }

    static error(message: string, options?: any) {
        toast.error(message, options);
    }

    static warning(message: string, options?: any) {
        toast.warning(message, options);
    }

    static info(message: string, options?: any) {
        toast.info(message, options);
    }
}