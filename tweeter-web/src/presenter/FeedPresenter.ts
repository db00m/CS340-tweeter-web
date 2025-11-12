import { StatusItemPresenter } from "./StatusItemPresenter";
import { PagedItemView } from "./PagedItemPresenter";
import { Status } from "tweeter-shared";

export class FeedPresenter extends StatusItemPresenter {

  public constructor(view: PagedItemView<Status>) {
    super(view);
  }

  protected itemDescription(): "feed" {
    return "feed";
  }

}