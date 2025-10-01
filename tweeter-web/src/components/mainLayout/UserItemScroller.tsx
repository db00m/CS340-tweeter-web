import { useState, useEffect, useRef, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { User } from "tweeter-shared";
import { useParams } from "react-router-dom";
import UserItem from "../userItem/UserItem";
import { useMessageActions } from "../toaster/MessageHooks";
import { useUserInfo, useUserInfoActions } from "../userInfo/UserInfoHooks";
import { UserItemPresenter, UserItemView } from "../../presenter/UserItemPresenter";

interface Props {
  featureUrl: string;
  presenterFactory: (listener: UserItemView) => UserItemPresenter;
}

const UserItemScroller = ({ featureUrl, presenterFactory }: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<User[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const listener: UserItemView = {
    addItems: (newItems: User[]) =>
      setItems((previousItems) => [...previousItems, ...newItems]),
    displayErrorMessage,
    setHasMoreItems
  }

  const presenter = useMemo(() => presenterFactory(listener), []);

  // Update the displayed user context variable whenever the displayedUser url parameter changes. This allows browser forward and back buttons to work correctly.
  useEffect(() => {
    if (
      authToken &&
      displayedUserAliasParam &&
      displayedUserAliasParam != displayedUser!.alias
    ) {
      presenter.getUser(authToken!, displayedUserAliasParam!).then((toUser) => {
        if (toUser) {
          setDisplayedUser(toUser);
        }
      });
    }
  }, [displayedUserAliasParam]);

  // Initialize the component whenever the displayed user changes
  useEffect(() => {
    presenter.reset();
    presenter.loadMoreItems(authToken!, displayedUser!.alias);
  }, [displayedUser]);

  return (
    <div className="container px-0 overflow-visible vh-100">
      <InfiniteScroll
        className="pr-0 mr-0"
        dataLength={items.length}
        next={() => presenter.loadMoreItems(authToken!, displayedUser!.alias)}
        hasMore={hasMoreItems}
        loader={<h4>Loading...</h4>}
      >
        {items.map((item, index) => (
          <div
            key={index}
            className="row mb-3 mx-0 px-0 border rounded bg-white"
          >
            <UserItem user={item} featurePath={featureUrl} />
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
}

export default UserItemScroller;