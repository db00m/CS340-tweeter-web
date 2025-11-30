import { FeedDAO } from "./FeedDAO";
import { FollowsDAO } from "./FollowsDAO";
import { SessionsDAO } from "./SessionsDAO";
import { StoryDAO } from "./StoryDAO";
import { UsersDAO } from "./UsersDAO";

export interface DAOFactory {
  getFeedDAO(): FeedDAO;
  getFollowsDAO(): FollowsDAO;
  getSessionsDAO(): SessionsDAO;
  getStoryDAO(): StoryDAO;
  getUsersDAO(): UsersDAO;
}