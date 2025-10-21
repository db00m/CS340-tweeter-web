import "./PostStatus.css";
import { useMemo, useState } from "react";
import {useMessageActions} from "../toaster/MessageHooks";
import {useUserInfo} from "../userInfo/UserInfoHooks";
import { PostPresenter, PostView } from "../../presenter/PostPresenter";

interface Props {
  presenter?: PostPresenter;
}

const PostStatus = (props: Props) => {
  const { displayErrorMessage, displayInfoMessage, deleteMessage } = useMessageActions();

  const { currentUser, authToken } = useUserInfo();
  const [post, setPost] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listener: PostView = {
    setIsLoading,
    setPost,
    displayInfoMessage,
    displayErrorMessage,
    deleteMessage
  }

  const presenter: PostPresenter = useMemo(() => props.presenter ?? new PostPresenter(listener), [listener]);

  const submitPost = async (event: React.MouseEvent) => {
    event.preventDefault();

    await presenter.submitPost(post, authToken!, currentUser!)
  };

  const clearPost = (event: React.MouseEvent) => {
    event.preventDefault();

    presenter.clearPost();
  };

  const checkButtonStatus: () => boolean = () => {
    return !post.trim() || !authToken || !currentUser;
  };

  return (
    <form>
      <div className="form-group mb-3">
        <textarea
          className="form-control"
          id="postStatusTextArea"
          rows={10}
          placeholder="What's on your mind?"
          value={post}
          onChange={(event) => {
            setPost(event.target.value);
          }}
        />
      </div>
      <div className="form-group">
        <button
          id="postStatusButton"
          className="btn btn-md btn-primary me-1"
          aria-label="post button"
          type="button"
          disabled={checkButtonStatus()}
          style={{ width: "8em" }}
          onClick={submitPost}
        >
          {isLoading ? (
            <span
              className="spinner-border spinner-border-sm"
              role="status"
              aria-hidden="true"
            ></span>
          ) : (
            <div>Post Status</div>
          )}
        </button>
        <button
          id="clearStatusButton"
          className="btn btn-md btn-secondary"
          aria-label="clear button"
          type="button"
          disabled={checkButtonStatus()}
          onClick={clearPost}
        >
          Clear
        </button>
      </div>
    </form>
  );
};

export default PostStatus;
