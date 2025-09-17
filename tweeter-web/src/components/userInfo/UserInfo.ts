import { User, AuthToken } from "tweeter-shared";

export interface UserInfo {
  currentUser: User | null;
  displayedUser: User | null;
  authToken: AuthToken | null;
}
