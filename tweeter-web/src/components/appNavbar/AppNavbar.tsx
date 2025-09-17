import "./AppNavbar.css";
import { useContext } from "react";
import {
  UserInfoContext,
  UserInfoActionsContext,
} from "../userInfo/UserInfoContexts";
import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Image from "react-bootstrap/Image";
import { ToastActionsContext } from "../toaster/ToastContexts";
import { AuthToken } from "tweeter-shared";
import { ToastType } from "../toaster/Toast";

const AppNavbar = () => {
  const location = useLocation();
  const { authToken, displayedUser } = useContext(UserInfoContext);
  const { clearUserInfo } = useContext(UserInfoActionsContext);
  const navigate = useNavigate();
  const { displayToast, deleteToast } = useContext(ToastActionsContext);

  const logOut = async () => {
    const loggingOutToastId = displayToast(ToastType.Info, "Logging Out...", 0);

    try {
      await logout(authToken!);

      deleteToast(loggingOutToastId);
      clearUserInfo();
      navigate("/login");
    } catch (error) {
      displayToast(
        ToastType.Error,
        `Failed to log user out because of exception: ${error}`,
        0
      );
    }
  };

  const logout = async (authToken: AuthToken): Promise<void> => {
    // Pause so we can see the logging out message. Delete when the call to the server is implemented.
    await new Promise((res) => setTimeout(res, 1000));
  };

  return (
    <Navbar
      collapseOnSelect
      className="mb-4"
      expand="md"
      bg="primary"
      variant="dark"
    >
      <Container>
        <Navbar.Brand>
          <div className="d-flex flex-row">
            <div className="p-2">
              <NavLink className="brand-link" to="/">
                <Image src={"/bird-white-32.png"} alt="" />
              </NavLink>
            </div>
            <div id="brand-title" className="p-3">
              <NavLink className="brand-link" to="/">
                <b>Tweeter</b>
              </NavLink>
            </div>
          </div>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item>
              <NavLink
                to={`/feed/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/feed/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Feed
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/story/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/story/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Story
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/followees/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/followees/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followees
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                to={`/followers/${displayedUser!.alias}`}
                className={() =>
                  location.pathname.startsWith("/followers/")
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                Followers
              </NavLink>
            </Nav.Item>
            <Nav.Item>
              <NavLink
                id="logout"
                onClick={logOut}
                to={location.pathname}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                Logout
              </NavLink>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
