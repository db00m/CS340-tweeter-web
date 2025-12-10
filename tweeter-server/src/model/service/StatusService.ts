import { StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { StoryDAO } from "./interfaces/StoryDAO";
import { FeedDAO } from "./interfaces/FeedDAO";
import { DAOFactory } from "./interfaces/DAOFactory";
import { AuthenticationService } from "./AuthenticationService";
import { FollowsDAO } from "./interfaces/FollowsDAO";
import { FeedQueueAdapter } from "./interfaces/FeedQueueAdapter";

export class StatusService implements Service {

  private storyDAO: StoryDAO;
  private feedDAO: FeedDAO;
  private followsDAO: FollowsDAO;
  private queueAdapter: FeedQueueAdapter;
  private authorizationService: AuthenticationService;

  constructor(daoFactory: DAOFactory, queueAdapter: FeedQueueAdapter) {
    this.storyDAO = daoFactory.getStoryDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    this.followsDAO = daoFactory.getFollowsDAO();
    this.queueAdapter = queueAdapter;
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
    await this.queueAdapter.appendToBatcherQueue({ statusDto: newStatus, authorAlias: currentUser });
  }

  async createBatches(
    newStatus: StatusDto,
    authorAlias: string,
  ): Promise<void> {
    let shouldContinue = true
    let lastAlias: string | undefined = undefined

    while(shouldContinue) {
      const [aliases, hasMore] = await this.followsDAO.getPaginatedFollowers(authorAlias, 100, lastAlias);
      shouldContinue = hasMore;
      lastAlias = aliases.at(-1);

      await this.queueAdapter.appendToBatchProcessorQueue({ statusDto: newStatus, followerAliases: aliases })
    }
  }

  async appendToFeeds(
    statusDto: StatusDto,
    followerAliases: string[],
  ) {
    await this.feedDAO.batchAddToFeed(followerAliases, statusDto);
  }
}