import { PostPresenter, PostView } from "../../src/presenter/PostPresenter";
import { StatusService } from "../../src/model.service/StatusService";
import { anything, capture, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";


describe('PostPresenter', () => {

  const post = "This is my post";
  const authToken = new AuthToken("abc123", Date.now());
  const currentUser = new User("Bilbo", "Baggins", "@bbaggins", "profile.png");

  let postPresenter: PostPresenter;
  let mockView: PostView;
  let mockService: StatusService;

  beforeEach(() => {
    mockView = mock<PostView>();

    const presenterSpy = spy(new PostPresenter(instance(mockView)))
    postPresenter = instance(presenterSpy);

    mockService = mock(StatusService);
    when(presenterSpy.statusService).thenReturn(instance(mockService));
  });

  describe('submitPost', () => {

    it("tells the view to display a posting status message", async () => {
      await postPresenter.submitPost(post, authToken, currentUser);

      verify(mockView.displayInfoMessage("Posting status...", anything())).once();
    });

    it("calls postStatus on the post status service with the correct status string and auth token", async () => {
      await postPresenter.submitPost(post, authToken, currentUser);

      verify(mockService.postStatus(authToken, anything())).once();
      const [_, status] = capture(mockService.postStatus).last();
      expect(status.post).toEqual(post);
    });

    describe("when posting is successful", () => {
      beforeEach(async () => {
        await postPresenter.submitPost(post, authToken, currentUser);
      });

      it("tells the view to clear the info message that was displayed previously", () => {
        verify(mockView.deleteMessage(anything())).once();
      });

      it("clear the post", () => {
        verify(mockView.setPost("")).once();
      });

      it("display a status posted message", () => {
        verify(mockView.displayInfoMessage("Status posted!", anything())).once();
      });
    });

    describe("when posting is not successful", () => {
      const error = new Error("Something went wrong");

      beforeEach(async () => {
        when(mockService.postStatus(anything(), anything())).thenThrow(error)

        await postPresenter.submitPost(post, authToken, currentUser);
      });

      it("tells the view to clear the info message", () => {
        verify(mockView.deleteMessage(anything())).once();
      });

      it("display an error message", () => {
        verify(mockView.displayErrorMessage(`Failed to post the status because of exception: Something went wrong`)).once();
      });

      it("does not tell it to clear the post or display a status posted message", () => {
        verify(mockView.setPost("")).never();
        verify(mockView.displayInfoMessage("Status posted!", anything())).never();

      });
    });
  });
});