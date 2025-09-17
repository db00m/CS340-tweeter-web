import "./Toaster.css";
import { useEffect } from "react";
import { useContext } from "react";
import { ToastListContext, ToastActionsContext } from "./ToastContexts";
import { Toast } from "react-bootstrap";

interface Props {
  position: string;
}

const Toaster = ({ position }: Props) => {
  const toastList = useContext(ToastListContext);
  const { deleteToast } = useContext(ToastActionsContext);

  useEffect(() => {
    const interval = setInterval(() => {
      if (toastList.length) {
        deleteExpiredToasts();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toastList]);

  const deleteExpiredToasts = () => {
    const now = Date.now();

    for (let toast of toastList) {
      if (
        toast.expirationMillisecond > 0 &&
        toast.expirationMillisecond < now
      ) {
        deleteToast(toast.id);
      }
    }
  };

  return (
    <>
      <div className={`toaster-container ${position}`}>
        {toastList.map((toast, i) => (
          <Toast
            id={toast.id}
            key={i}
            className={toast.bootstrapClasses}
            autohide={false}
            show={true}
            onClose={() => deleteToast(toast.id)}
          >
            <Toast.Header>
              <img
                src="holder.js/20x20?text=%20"
                className="rounded me-2"
                alt=""
              />
              <strong className="me-auto">{toast.title}</strong>
            </Toast.Header>
            <Toast.Body>{toast.text}</Toast.Body>
          </Toast>
        ))}
      </div>
    </>
  );
};

export default Toaster;
