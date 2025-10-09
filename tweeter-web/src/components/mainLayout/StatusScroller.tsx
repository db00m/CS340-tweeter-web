import { AuthToken, Status } from "tweeter-shared";
import { useState, useEffect, useMemo } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import StatusItem from "../statusItem/StatusItem";
import {useMessageActions} from "../toaster/MessageHooks";
import {useUserInfo, useUserInfoActions} from "../userInfo/UserInfoHooks";
import { StatusItemPresenter, StatusItemView } from "../../presenter/StatusItemPresenter";

export const PAGE_SIZE = 10;

interface Props {
  featureUrl: string;
  presenterFactory: (listener: StatusItemView) => StatusItemPresenter;
}

const StatusScroller = ({ featureUrl, presenterFactory }: Props) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<Status[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const addItems = (newItems: Status[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  const listener: StatusItemView = {
    addItems,
    displayErrorMessage,
    setHasMoreItems
  }

  const presenter: StatusItemPresenter = useMemo(() => presenterFactory(listener), []);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

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
    setItems(() => []);
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
                <StatusItem status={item} featurePath={featureUrl}/>
            </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default StatusScroller;
