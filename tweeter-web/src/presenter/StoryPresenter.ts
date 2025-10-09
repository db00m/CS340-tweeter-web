import { StatusItemPresenter, StatusItemView } from "./StatusItemPresenter";

export class StoryPresenter extends StatusItemPresenter {

  public constructor(view: StatusItemView) {
    super(view);
    this.itemDescription = "story";
  }

}