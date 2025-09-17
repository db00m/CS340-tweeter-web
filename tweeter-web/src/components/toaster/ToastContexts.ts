import { createContext } from "react";
import { Toast, ToastType } from "./Toast";

export const ToastListContext = createContext<Toast[]>([]);

interface ToastActions {
  displayExistingToast: (toast: Toast) => void,
  displayToast: (
    toastType: ToastType,
    message: string,
    duration: number,
    title?: string,
    bootstrapClasses?: string,
  ) => string,
  deleteToast: (_toast: string) => void,
  deleteAllToasts: () => void,
};

const defaultToastActions: ToastActions = {
  displayExistingToast: () => null,
  displayToast: () => "",
  deleteToast: () => null,
  deleteAllToasts: () => null,
}

export const ToastActionsContext = createContext<ToastActions>(defaultToastActions);
