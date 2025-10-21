import { render, screen } from "@testing-library/react";
import PostStatus from "../../../src/components/postStatus/PostStatus";
import { useUserInfo } from "../../../src/components/userInfo/UserInfoHooks";
import { AuthToken, User } from "tweeter-shared";
import Post from "../../../src/components/statusItem/Post";
import { PostPresenter } from "../../../src/presenter/PostPresenter";
import "@testing-library/jest-dom";
import { userEvent } from "@testing-library/user-event";
import { instance, mock, verify } from "@typestrong/ts-mockito";

jest.mock("../../../src/components/userInfo/UserInfoHooks", () => ({
  ...jest.requireActual("../../../src/components/userInfo/UserInfoHooks"),
  __esModule: true,
  useUserInfo: jest.fn(),
}));

describe("PostStatus Component", () => {

  const testUser = new User("Bilbo", "Baggins", "@bbaggins", "image.png");
  const authToken = new AuthToken("abc123", Date.now());

  const status = "This is my status";

  beforeAll(() => {
    (useUserInfo as jest.Mock).mockReturnValue({
      currentUser: testUser,
      authToken: authToken,
    });
  });

  let postButton: HTMLElement;
  let clearButton: HTMLElement;
  let textArea: HTMLElement;

  let mockPresenter: PostPresenter;

  beforeEach(() => {
    mockPresenter = mock<PostPresenter>();

    const { postButtonElement, clearButtonElement, textAreaElement } = getElements(instance(mockPresenter));

    postButton = postButtonElement;
    clearButton = clearButtonElement;
    textArea = textAreaElement;
  });

  describe("when first rendered", () => {
    it("starts with Post and Clear buttons disabled", () => {
      expect(postButton).toBeDisabled();
      expect(clearButton).toBeDisabled();
    })
  });

  describe("When user populates text field", () => {
    const user = userEvent.setup();

    beforeEach(async () => {
      await user.type(textArea, status);
    });

    it("enables Post and Clear buttons", () => {
      expect(postButton).toBeEnabled();
      expect(clearButton).toBeEnabled();
    });

    describe("and user clears text field manually", () => {

      beforeEach(async () => {
        await user.clear(textArea);
      })

      it("disables post and clear buttons", () => {
        expect(postButton).toBeDisabled();
        expect(clearButton).toBeDisabled();
      });
    });

    describe("and user clicks Post Status button", () => {

      beforeEach(async () => {
        await user.click(postButton);
      })

      it("calls the PostStatusPresenter PostStatusMethod with the correct parameters", () => {
        verify(mockPresenter.submitPost(status, authToken, testUser)).once();
      });
    });
  });
});

function renderComponent(presenter?: PostPresenter) {
  return render(
    presenter ? (
        <PostStatus presenter={presenter}/>
      ) : (
        <PostStatus />
      )
  )
}

function getElements(presenter?: PostPresenter) {
  renderComponent(presenter);

  const postButtonElement = screen.getByLabelText("post button");
  const clearButtonElement = screen.getByLabelText("clear button");
  const textAreaElement = screen.getByRole("textbox");

  return { postButtonElement, clearButtonElement, textAreaElement };
}