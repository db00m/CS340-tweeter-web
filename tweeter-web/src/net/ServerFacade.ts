import { ClientCommunicator } from "./ClientCommunicator";
import { PagedUserItemRequest, PagedUserItemResponse, User, UserDto } from "tweeter-shared";

export class ServerFacade {
  private SERVER_URL = "https://tweeter-api.dbl00m11.click"
  private readonly clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getFollowers(request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator
      .doPost<PagedUserItemRequest, PagedUserItemResponse>(request, "/followers");

    if (!response.success || response.items === undefined) {
      throw new Error(`Could not get followers: ${response.message}`);
    }

    const users = response.items!.map((user: UserDto) => User.fromDto(user));
    return [users, response.hasMore]
  }
}