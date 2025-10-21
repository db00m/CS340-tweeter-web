import "./Login.css";
import "bootstrap/dist/css/bootstrap.css";``
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthenticationFormLayout from "../AuthenticationFormLayout";
import AuthenticationFields from "../AuthenticationFields";
import {useMessageActions} from "../../toaster/MessageHooks";
import {useUserInfoActions} from "../../userInfo/UserInfoHooks";
import { LoginPresenter } from "../../../presenter/LoginPresenter";
import { AuthenticationPresenter, AuthenticationView } from "../../../presenter/AuthenticationPresenter";

interface Props {
  originalUrl?: string;
  presenter?: LoginPresenter;
}

const Login = (props: Props) => {
  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { updateUserInfo } = useUserInfoActions();
  const { displayErrorMessage } = useMessageActions();

  const listener: AuthenticationView = {
    setIsLoading,
    updateUserInfo,
    navigate,
    displayErrorMessage
  }
  const presenter = useMemo(() => props.presenter ?? new LoginPresenter(listener, props.originalUrl), []);

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

  const doLogin = async () => {
    await presenter.doLogin(rememberMe, alias, password)
  };

  const inputFieldFactory = () => {
    return (
        <AuthenticationFields onEnter={doLogin} onPasswordChange={setPassword} onAliasChange={setAlias} isBottom={true}/>
    );
  };

  const switchAuthenticationMethodFactory = () => {
    return (
      <div className="mb-3">
        Not registered? <Link to="/register">Register</Link>
      </div>
    );
  };

  return (
    <AuthenticationFormLayout
      headingText="Please Sign In"
      submitButtonLabel="Sign in"
      oAuthHeading="Sign in with:"
      inputFieldFactory={inputFieldFactory}
      switchAuthenticationMethodFactory={switchAuthenticationMethodFactory}
      setRememberMe={setRememberMe}
      submitButtonDisabled={checkSubmitButtonStatus}
      isLoading={isLoading}
      submit={doLogin}
    />
  );
};

export default Login;
