import { Status, User } from "tweeter-shared";
import { useState, useEffect, useMemo, ReactNode } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useParams } from "react-router-dom";
import {useMessageActions} from "../toaster/MessageHooks";
import {useUserInfo, useUserInfoActions} from "../userInfo/UserInfoHooks";
import { PagedItemPresenter, PagedItemView } from "../../presenter/PagedItemPresenter";

interface Props<T extends User | Status, U extends PagedItemPresenter<T>> {
  featureUrl: string;
  presenterFactory: (listener: PagedItemView<T>) => U;
  featureComponentFactory: (item: T, featurePath: string) => ReactNode;
}

const ItemScroller = <T extends User | Status, U extends PagedItemPresenter<T>,>(
  { featureUrl, presenterFactory, featureComponentFactory }: Props<T, U>) => {
  const { displayErrorMessage } = useMessageActions();
  const [items, setItems] = useState<T[]>([]);
  const [hasMoreItems, setHasMoreItems] = useState(true);

  const { displayedUser, authToken } = useUserInfo();
  const { setDisplayedUser } = useUserInfoActions();
  const { displayedUser: displayedUserAliasParam } = useParams();

  const addItems = (newItems: T[]) =>
    setItems((previousItems) => [...previousItems, ...newItems]);

  const listener: PagedItemView<T> = {
    addItems,
    displayErrorMessage,
    setHasMoreItems
  }

  const presenter: PagedItemPresenter<T> = useMemo(() => presenterFactory(listener), []);

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
            {featureComponentFactory(item, featureUrl)}
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export default ItemScroller;
