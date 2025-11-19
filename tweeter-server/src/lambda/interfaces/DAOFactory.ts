import { FeedDAO } from "../../model/service/interfaces/FeedDAO";
import { FollowsDAO } from "../../model/service/interfaces/FollowsDAO";
import { SessionsDAO } from "../../model/service/interfaces/SessionsDAO";
import { StoryDAO } from "../../model/service/interfaces/StoryDAO";
import { UsersDAO } from "../../model/service/interfaces/UsersDAO";

export interface DAOFactory {
  getFeedDAO(): FeedDAO;
  getFollowsDAO(): FollowsDAO;
  getSessionsDAO(): SessionsDAO;
  getStoryDAO(): StoryDAO;
  getUsersDAO(): UsersDAO;
}