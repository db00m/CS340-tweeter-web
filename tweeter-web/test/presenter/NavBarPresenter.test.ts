import { NavBarPresenter, NavBarView } from "../../src/presenter/NavBarPresenter";
import { anything, instance, mock, spy, verify, when } from "@typestrong/ts-mockito";
import { AuthToken, User } from "tweeter-shared";
import { UserService } from "../../src/model.service/UserService";
import appNavbar from "../../src/components/appNavbar/AppNavbar";
import { isRouteErrorResponse } from "react-router-dom";

describe("NavBarPresenter", () => {
  let mockView: NavBarView;
  let navBarPresenter: NavBarPresenter;
  let mockService: UserService;

  const authToken = new AuthToken("abc123", Date.now());

  beforeEach(async () => {
    mockView = mock<NavBarView>();

    const presenterSpy = spy(new NavBarPresenter(instance(mockView)))
    navBarPresenter = instance(presenterSpy);

    mockService = mock<UserService>();
    when(presenterSpy.userService).thenReturn(instance(mockService));
  });

  it("tells the view to display a logging out message", async () => {
    await navBarPresenter.logOut(authToken);

    verify(mockView.displayInfoMessage(anything(), 0)).once();
  });

  it("calls logout on the user service with the correct auth token", async () => {
    await navBarPresenter.logOut(authToken);

    verify(mockService.logout(authToken)).once();
  });

  describe("when logout is successful", () => {
    it("tells the view to clear the info message that was displayed previously", async () => {
      await navBarPresenter.logOut(authToken);

      verify(mockView.deleteMessage(anything())).once();
    });

    it("tells the view to clear the user info", async () => {
      await navBarPresenter.logOut(authToken);

      verify(mockView.clearUserInfo()).once();
    });

    it("tells the view to navigate to the login page", async () => {
      await navBarPresenter.logOut(authToken);

      verify(mockView.navigate("/login")).once();
    });
  });

  describe("when logout is not successful", () => {
    const errorMessage = "Logout was not successful";

    beforeEach(() => {
      let error = new Error(errorMessage);
      when(mockService.logout(anything())).thenThrow(error);
    })

    it("tells the view to display an error message", async () => {
      await navBarPresenter.logOut(authToken);

      verify(mockView.displayErrorMessage(`Failed to log user out because of exception: ${errorMessage}`)).once();
    });

    it("does not tell it to clear the info message", async () => {
      await navBarPresenter.logOut(authToken);

      verify(mockView.deleteMessage(anything())).never();
    });

    it("does not clear the user info", async () => {
      await navBarPresenter.logOut(authToken);

      verify(mockView.clearUserInfo()).never();
    })

    it("does not navigate to the login page.", async () => {
      await navBarPresenter.logOut(authToken);

      verify(mockView.navigate("/login")).never();
    })

  })
});