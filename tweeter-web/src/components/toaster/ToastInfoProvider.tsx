import { useCallback, useMemo, useState } from "react";
import { Toast, ToastType, makeToast } from "./Toast";
import PropTypes from "prop-types";
import { ToastListContext, ToastActionsContext } from "./ToastContexts";

interface Props {
  children: React.ReactNode;
}

const ToastInfoProvider: React.FC<Props> = ({ children }) => {
  const [toastList, setToastList] = useState<Toast[]>([]);

  const displayExistingToast = useCallback((toast: Toast) => {
    setToastList((previousList) => [...previousList, toast]);
  }, []);

  const displayToast = useCallback(
    (
      toastType: ToastType,
      message: string,
      duration: number,
      title?: string,
      bootstrapClasses?: string
    ): string => {
      const toast = makeToast(
        toastType,
        message,
        duration,
        title,
        bootstrapClasses
      );
      displayExistingToast(toast);
      return toast.id;
    },
    [displayExistingToast]
  );

  const deleteToast = useCallback((id: string) => {
    setToastList((currentList) => {
      const filtered = currentList.filter((x) => x.id !== id);
      return filtered;
    });
  }, []);

  const deleteAllToasts = useCallback(() => {
    setToastList([]);
  }, []);

  const toastActions = useMemo(
    () => ({
      displayExistingToast,
      displayToast,
      deleteToast,
      deleteAllToasts,
    }),
    [displayExistingToast, displayToast, deleteToast, deleteAllToasts]
  );

  return (
    <ToastListContext.Provider value={toastList}>
      <ToastActionsContext.Provider value={toastActions}>
        {children}
      </ToastActionsContext.Provider>
    </ToastListContext.Provider>
  );
};

ToastInfoProvider.propTypes = {
  children: PropTypes.element.isRequired,
};

export default ToastInfoProvider;
