import { ClientCommunicator } from "./ClientCommunicator";
import {
  CountResponse, FollowActionResponse,
  FollowStatusRequest,
  FollowStatusResponse,
  PagedUserItemRequest,
  PagedUserItemResponse, TweeterRequest,
  User,
  UserDto
} from "tweeter-shared";

export class ServerFacade {
  private SERVER_URL = "https://tweeter-api.dbl00m11.click"
  private readonly clientCommunicator = new ClientCommunicator(this.SERVER_URL);

  public async getUsers(userType: "followee" | "follower", request: PagedUserItemRequest): Promise<[User[], boolean]> {
    const response = await this.clientCommunicator
      .doPost<PagedUserItemRequest, PagedUserItemResponse>(request, `/${userType}s`);

    if (!response.success || response.items === undefined) {
      throw new Error(`Could not get ${userType}s: ${response.message}`);
    }

    const users = response.items!.map((user: UserDto) => User.fromDto(user));
    return [users, response.hasMore]
  }

  public async getFollowStatus(request: FollowStatusRequest): Promise<boolean> {
    const response = await this.clientCommunicator
      .doPost<FollowStatusRequest, FollowStatusResponse>(request, "/follow_status");

    if(!response.success) {
      throw new Error(`Could not get follow status: ${response.message}`);
    }

    return response.isFollower
  }

  public async getFollowerCount(request: TweeterRequest): Promise<number> {
    const response = await this.clientCommunicator
      .doPost<TweeterRequest, CountResponse>(request, "/followers/count");

    if(!response.success) {
      throw new Error(`Could not get followers count: ${response.message}`);
    }

    return response.count;
  }

  public async getFolloweeCount(request: TweeterRequest): Promise<number> {
    const response = await this.clientCommunicator
      .doPost<TweeterRequest, CountResponse>(request, "/followees/count");

    if(!response.success) {
      throw new Error(`Could not get followees count: ${response.message}`);
    }

    return response.count;
  }

  public async createFollow(request: TweeterRequest): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator
      .doPost<TweeterRequest, FollowActionResponse>(request, "/follow");

    if(!response.success) {
      throw new Error(`Could not follow: ${response.message}`);
    }

    return [response.followerCount, response.followeeCount];
  }

  public async deleteFollow(request: TweeterRequest): Promise<[followerCount: number, followeeCount: number]> {
    const response = await this.clientCommunicator
      .doPost<TweeterRequest, FollowActionResponse>(request, "/unfollow");

    if(!response.success) {
      throw new Error(`Could not unfollow: ${response.message}`);
    }

    return [response.followerCount, response.followeeCount];
  }
}