import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class FeedPresenter extends StatusItemPresenter {

  public constructor(view: StatusItemView) {
    super(view);
    this.itemDescription = "feed";
  }

}