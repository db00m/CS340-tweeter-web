import Login from "../../../../src/components/authentication/login/Login";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { UserEvent, userEvent } from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { instance, mock, verify } from "@typestrong/ts-mockito";
import { LoginPresenter } from "../../../../src/presenter/LoginPresenter";

library.add(fab);

describe("Login Component", () => {

  describe("when component first renders", () => {
    it("starts with the sign in button disabled", () => {
      const { signInButton } = renderAndGetElements("/");
      expect(signInButton).toBeDisabled();
    });
  });

  describe("when user populates both fields", () => {

    const alias = "@alias";
    const password = "password";
    const originalUrl = "http://testurl.test"

    let aliasInput: HTMLElement, passwordInput: HTMLElement, signInButtonElement: HTMLElement;
    let testUser: UserEvent;
    let mockPresenter: LoginPresenter;

    beforeEach(async () => {
      mockPresenter = mock(LoginPresenter);

      const { signInButton, user, aliasField, passwordField } = renderAndGetElements(originalUrl, instance(mockPresenter));
      aliasInput = aliasField;
      passwordInput = passwordField;
      signInButtonElement = signInButton;
      testUser = user;

      await testUser.type(aliasField, alias);
      await testUser.type(passwordField, password);
    })

    it("enables the sign in button", async () => {
      expect(signInButtonElement).toBeEnabled();
    });

    describe("and user clears the alias field", () => {
      beforeEach(async () => {
        expect(signInButtonElement).toBeEnabled();

        await testUser.clear(aliasInput);
      })

      it("disables the sign in button", async () => {
        expect(signInButtonElement).toBeDisabled();
      })
    });

    describe("and user clears the password field", () => {
      beforeEach(async () => {
        expect(signInButtonElement).toBeEnabled();

        await testUser.clear(passwordInput);
      })

      it("disables the sign in button", async () => {
        expect(signInButtonElement).toBeDisabled();
      })
    });

    describe("and user clicks the sign in button", () => {
      it("call's the presenter's login method with the correct parameters", async () => {
        await testUser.click(signInButtonElement);

        verify(mockPresenter.doLogin(false, alias, password)).once();
      })
    });
  })
});

function renderLogin(originalUrl: string, presenter?: LoginPresenter) {

  return render(
    <MemoryRouter>
      { presenter ? (
        <Login originalUrl={originalUrl} presenter={presenter} />
      ) : (
        <Login originalUrl={originalUrl} />
        ) }
    </MemoryRouter>
  );
}

function renderAndGetElements(originalUrl: string, presenter?: LoginPresenter) {
  const user = userEvent.setup();

  renderLogin(originalUrl, presenter);

  const signInButton = screen.getByRole("button", { name: /Sign In/i });
  const aliasField = screen.getByLabelText("alias");
  const passwordField = screen.getByLabelText("password");

  return { user, signInButton, aliasField, passwordField };
}