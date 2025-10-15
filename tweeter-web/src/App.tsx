import "./App.css";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Login from "./components/authentication/login/Login";
import Register from "./components/authentication/register/Register";
import MainLayout from "./components/mainLayout/MainLayout";
import Toaster from "./components/toaster/Toaster";
import StatusScroller from "./components/mainLayout/StatusScroller";
import UserItemScroller from "./components/mainLayout/UserItemScroller";
import {useUserInfo} from "./components/userInfo/UserInfoHooks";
import { FolloweePresenter } from "./presenter/FolloweePresenter";
import { FollowerPresenter } from "./presenter/FollowerPresenter";
import { FeedPresenter } from "./presenter/FeedPresenter";
import { StoryPresenter } from "./presenter/StoryPresenter";
import { PagedItemView } from "./presenter/PagedItemPresenter";
import { Status, User } from "tweeter-shared";

const App = () => {
  const { currentUser, authToken } = useUserInfo();

  const isAuthenticated = (): boolean => {
    return !!currentUser && !!authToken;
  };

  return (
    <div>
      <Toaster position="top-right" />
      <BrowserRouter>
        {isAuthenticated() ? (
          <AuthenticatedRoutes />
        ) : (
          <UnauthenticatedRoutes />
        )}
      </BrowserRouter>
    </div>
  );
};

const AuthenticatedRoutes = () => {
  const { displayedUser } = useUserInfo();

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route
          path="feed/:displayedUser"
          element={
            <StatusScroller
              key={`feed-${displayedUser!.alias}`}
              featureUrl="/feed"
              presenterFactory={(listener: PagedItemView<Status>) => new FeedPresenter(listener)}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <StatusScroller
              key={`story-${displayedUser!.alias}`}
              featureUrl="/story"
              presenterFactory={(listener: PagedItemView<Status>) => new StoryPresenter(listener)}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <UserItemScroller
              key={`followees-${displayedUser!.alias}`}
              featureUrl="/followees"
              presenterFactory={(view: PagedItemView<User>) => new FolloweePresenter(view)}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <UserItemScroller
              key={`followers-${displayedUser!.alias}`}
              featureUrl="/followers"
              presenterFactory={(view: PagedItemView<User>) => new FollowerPresenter(view)}

            />
          }
        />
        <Route path="logout" element={<Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
      </Route>
    </Routes>
  );
};

const UnauthenticatedRoutes = () => {
  const location = useLocation();

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login originalUrl={location.pathname} />} />
    </Routes>
  );
};

export default App;
