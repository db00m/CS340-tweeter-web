import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { StoryDAO } from "./interfaces/StoryDAO";
import { FeedDAO } from "./interfaces/FeedDAO";
import { DAOFactory } from "./interfaces/DAOFactory";
import { AuthenticationService } from "./AuthenticationService";
import { FollowsDAO } from "./interfaces/FollowsDAO";

export class StatusService implements Service {

  private storyDAO: StoryDAO;
  private feedDAO: FeedDAO;
  private followsDAO: FollowsDAO;
  private authorizationService: AuthenticationService;

  constructor(daoFactory: DAOFactory) {
    this.storyDAO = daoFactory.getStoryDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    this.followsDAO = daoFactory.getFollowsDAO();
    this.authorizationService = new AuthenticationService(daoFactory.getSessionsDAO());
  }

  async fetchStoryPage(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ) {

    await this.authorizationService.authenticate(authToken);

    return await this.storyDAO.getPaginatedStory(userAlias, pageSize, lastItem);
  }

  async fetchFeedPage(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ) {

    await this.authorizationService.authenticate(authToken);

    return await this.feedDAO.getPaginatedFeed(userAlias, pageSize, lastItem);
  }

  async postStatus(
    authToken: string,
    newStatus: StatusDto
  ): Promise<void> {

    const currentUser = await this.authorizationService.authenticate(authToken)

    await this.storyDAO.addToStory(newStatus);
    let hasMore = true
    let lastAlias: string | undefined = undefined;
    while (hasMore) {
      const [followerAliases, hasMoreResult] = await this.followsDAO.getPaginatedFollowers(currentUser, 1000, lastAlias);
      hasMore = hasMoreResult;
      lastAlias = followerAliases.at(-1);

      await this.feedDAO.batchAddToFeed(followerAliases, newStatus);
    }
  };
}