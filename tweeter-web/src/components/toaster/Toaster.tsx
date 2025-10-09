import "./Toaster.css";
import { useEffect } from "react";
import { Toast } from "react-bootstrap";
import {useMessageActions, useMessageList} from "./MessageHooks";
import { ToasterPresenter, ToasterView } from "../../presenter/ToasterPresenter";

interface Props {
  position: string;
}

const Toaster = ({ position }: Props) => {
  const messageList = useMessageList();
  const { deleteMessage } = useMessageActions();

  const listener: ToasterView = { deleteMessage };
  const presenter: ToasterPresenter = new ToasterPresenter(listener);

  useEffect(() => {
    const interval = setInterval(() => {
      if (messageList.length) {
        presenter.deleteExpiredToasts(messageList);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageList]);

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
