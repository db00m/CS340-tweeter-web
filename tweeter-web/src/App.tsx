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
import {AuthToken, FakeData, Status, User} from "tweeter-shared";
import {useUserInfo} from "./components/userInfo/UserInfoHooks";
import { UserItemPresenter, UserItemView } from "./presenter/UserItemPresenter";

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

  const handleLoadMoreStatuses = async (
    authToken: AuthToken,
    userAlias: string,
    pageSize: number,
    lastItem: Status | null
  ): Promise<[Status[], boolean]> => {
    // TODO: Replace with the result of calling server
    return FakeData.instance.getPageOfStatuses(lastItem, pageSize);
  };

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<Navigate to={`/feed/${displayedUser!.alias}`} />} />
        <Route
          path="feed/:displayedUser"
          element={
            <StatusScroller
              key={`feed-${displayedUser!.alias}`}
              itemDescription="feed"
              featureUrl="/feed"
              onLoadMore={handleLoadMoreStatuses}
            />
          }
        />
        <Route
          path="story/:displayedUser"
          element={
            <StatusScroller
              key={`story-${displayedUser!.alias}`}
              itemDescription="story"
              featureUrl="/story"
              onLoadMore={handleLoadMoreStatuses}
            />
          }
        />
        <Route
          path="followees/:displayedUser"
          element={
            <UserItemScroller
              key={`followees-${displayedUser!.alias}`}
              featureUrl="/followees"
              presenterFactory={(view: UserItemView) => new UserItemPresenter(view, 'followee')}
            />
          }
        />
        <Route
          path="followers/:displayedUser"
          element={
            <UserItemScroller
              key={`followers-${displayedUser!.alias}`}
              featureUrl="/followers"
              presenterFactory={(view: UserItemView) => new UserItemPresenter(view, 'follower')}

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
