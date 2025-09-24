import "./Toaster.css";
import { useEffect } from "react";
import { Toast } from "react-bootstrap";
import {useMessageActions, useMessageList} from "./MessageHooks";

interface Props {
  position: string;
}

const Toaster = ({ position }: Props) => {
  const messageList = useMessageList();
  const { deleteMessage } = useMessageActions();

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageList.length) {
        deleteExpiredToasts();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList]);

  const deleteExpiredToasts = () => {
    const now = Date.now();

    for (let toast of messageList) {
      if (
        toast.expirationMillisecond > 0 &&
        toast.expirationMillisecond < now
      ) {
        deleteMessage(toast.id);
      }
    }
  };

  return (
    <>
      <div className={`toaster-container ${position}`}>
        {messageList.map((toast, i) => (
          <Toast
            id={toast.id}
            key={i}
            className={toast.bootstrapClasses}
            autohide={false}
            show={true}
            onClose={() => deleteMessage(toast.id)}
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
