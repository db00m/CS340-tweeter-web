import { v4 as uuid } from "uuid";

export enum ToastType {
  Success = "Success",
  Error = "Error",
  Info = "Info",
  Warning = "Warning",
  Other = "",
}
export interface Toast {
  id: string;
  title: string;
  text: string;
  type: ToastType;
  expirationMillisecond: number;
  bootstrapClasses: string;
}

export function makeToast(
  type: ToastType,
  text: string,
  deleteAfterMillis: number,
  title?: string,
  bootstrapClasses: string = ""
): Toast {
  return {
    id: uuid(),
    title: title ?? type,
    text: text,
    type: type,
    expirationMillisecond:
      deleteAfterMillis > 0 ? Date.now() + deleteAfterMillis : 0,
    bootstrapClasses: bootstrapClasses
  };
};
