import { DAOFactory } from "../../../lambda/interfaces/DAOFactory";
import { FeedDAO } from "../../service/interfaces/FeedDAO";
import { FollowsDAO } from "../../service/interfaces/FollowsDAO";
import { SessionsDAO } from "../../service/interfaces/SessionsDAO";
import { StoryDAO } from "../../service/interfaces/StoryDAO";
import { UsersDAO } from "../../service/interfaces/UsersDAO";
import { FeedDynamoDAO } from "./FeedDynamoDAO";
import { FollowsDynamoDAO } from "./FollowsDynamoDAO";
import { SessionsDynamoDAO } from "./SessionsDynamoDAO";
import { StoryDynamoDAO } from "./StoryDynamoDAO";
import { UsersDynamoDAO } from "./UsersDynamoDAO";

export class DynamoDAOFactory implements DAOFactory {
  getFeedDAO(): FeedDAO {
    return new FeedDynamoDAO();
  }

  getFollowsDAO(): FollowsDAO {
    return new FollowsDynamoDAO();
  }

  getSessionsDAO(): SessionsDAO {
    return new SessionsDynamoDAO();
  }

  getStoryDAO(): StoryDAO {
    return new StoryDynamoDAO();
  }

  getUsersDAO(): UsersDAO {
    return new UsersDynamoDAO();
  }
}