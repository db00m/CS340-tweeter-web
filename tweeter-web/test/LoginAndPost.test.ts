import { ServerFacade } from "../src/net/ServerFacade";
import { CreateAuthRequest } from "tweeter-shared";
import "isomorphic-fetch";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { PostPresenter, PostView } from "../src/presenter/PostPresenter";

jest.setTimeout(30000);

describe("LoginAndPost", () => {
  let server: ServerFacade;
  const testPassword = "password"
  const testAlias = "@1"

  let postPresenter: PostPresenter;
  let mockView: PostView;

  beforeEach(() => {
    server = new ServerFacade();
    mockView = mock<PostView>();
    postPresenter = new PostPresenter(instance(mockView));
  })

  it("is able to login and post a status", async () => {
    const request: CreateAuthRequest = {
      password: testPassword,
      alias: testAlias,
      token: "null",
      userAlias: testAlias
    }

    const [user, authToken] = await server.login(request);

    expect(user).not.toBe(undefined);
    expect(authToken).not.toBe(undefined);
    expect(user.alias).toBe(testAlias);

    await postPresenter.submitPost("This is a post from a test", authToken, user);
    verify(mockView.displayInfoMessage("Status posted!", 2000)).once()

    const [retrievedStatuses, hasMore] = await server.getStatuses("story", { token: authToken.token, pageSize: 1, userAlias: "@1", lastItem: null })
    const retrievedStatus = retrievedStatuses[0];

    expect(retrievedStatus).not.toBe(undefined);
    expect(retrievedStatus.post).toEqual("This is a post from a test");
  });
});
