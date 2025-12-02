import { AuthToken, FakeData, Status, StatusDto } from "tweeter-shared";
import { Service } from "./Service";
import { StoryDAO } from "./interfaces/StoryDAO";
import { FeedDAO } from "./interfaces/FeedDAO";
import { DAOFactory } from "./interfaces/DAOFactory";
import { AuthenticationService } from "./AuthenticationService";

export class StatusService implements Service {

  private storyDAO: StoryDAO;
  private feedDAO: FeedDAO;
  private authorizationService: AuthenticationService;

  constructor(daoFactory: DAOFactory) {
    this.storyDAO = daoFactory.getStoryDAO();
    this.feedDAO = daoFactory.getFeedDAO();
    this.authorizationService = new AuthenticationService(daoFactory.getSessionsDAO());
  }

  async loadMoreStatuses(
    authToken: string,
    userAlias: string,
    pageSize: number,
    lastItem: StatusDto | null
  ): Promise<[StatusDto[], boolean]> {
    const [statuses, hasMore]: [Status[], boolean] = FakeData.instance.getPageOfStatuses(lastItem ? Status.fromDto(lastItem) : null, pageSize);
    return [statuses.map((status) => status.toDto()), hasMore]
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

    await this.authorizationService.authenticate(authToken)

    await this.storyDAO.addToStory(newStatus);
  };
}