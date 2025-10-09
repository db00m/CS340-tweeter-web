import { Toast } from "../components/toaster/Toast";

export interface ToasterView {
  deleteMessage: (messageId: string) => void;
}

export class ToasterPresenter {
  private view: ToasterView;

  public constructor(view: ToasterView) {
    this.view = view;
  }

  deleteExpiredToasts (messageList: Toast[]) {
    const now = Date.now();

    for (let toast of messageList) {
      if (
        toast.expirationMillisecond > 0 &&
        toast.expirationMillisecond < now
      ) {
        this.view.deleteMessage(toast.id);
      }
    }
  };
}