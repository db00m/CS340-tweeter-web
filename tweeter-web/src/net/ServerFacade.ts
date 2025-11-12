import { ClientCommunicator } from "./ClientCommunicator";
import {
  AuthToken,
  CountResponse, CreateAuthRequest, CreateAuthResponse, CreateUserRequest, FollowActionResponse,
  FollowStatusRequest,
  FollowStatusResponse, GetUserResponse, PagedStatusItemRequest, PagedStatusItemResponse,
  PagedUserItemRequest,
  PagedUserItemResponse, PostRequest, Status, StatusDto, TweeterRequest, TweeterResponse,
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

  public async postStatus(request: PostRequest): Promise<void> {
    const response = await this.clientCommunicator
      .doPost<PostRequest, TweeterResponse>(request, "/post");

    if(!response.success) {
      throw new Error(`Could not post: ${response.message}`);
    }
  }

  public async getStatuses(statusType: "story" | "feed", request: PagedStatusItemRequest): Promise<[Status[], boolean]> {
    const response = await this.clientCommunicator
      .doPost<PagedStatusItemRequest, PagedStatusItemResponse>(request, `/${statusType}`);

    if(!response.success || response.items === undefined) {
      throw new Error(`Could not get ${statusType}: ${response.message}`);
    }

    const items: Status[] = response.items!.map((status: StatusDto): Status => Status.fromDto(status))

    return [items, response.hasMore]
  }

  public async login(request: CreateAuthRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator
      .doPost<CreateAuthRequest, CreateAuthResponse>(request, "/login");

    if(!response.success || response.user === null || response.authToken === null) {
      throw new Error(`Could not login: ${response.message}`);
    }

    return [User.fromDto(response.user), AuthToken.fromDto(response.authToken)]
  }

  public async logout(request: TweeterRequest) {
    const response = await this.clientCommunicator
      .doPost<TweeterRequest, TweeterResponse>(request, "/logout");

    if(!response.success) {
      throw new Error(`Could not logout: ${response.message}`);
    }
  }

  public async register(request: CreateUserRequest): Promise<[User, AuthToken]> {
    const response = await this.clientCommunicator
      .doPost<CreateUserRequest, CreateAuthResponse>(request, "/register");

    if(!response.success || response.user === null || response.authToken === null) {
      throw new Error(`Could not register: ${response.message}`);
    }

    return [User.fromDto(response.user), AuthToken.fromDto(response.authToken)]
  }

  public async getUser(request: TweeterRequest): Promise<User> {
    const response = await this.clientCommunicator
    .doPost<TweeterRequest, GetUserResponse>(request, "/user");

    if(!response.success || response.user === null) {
      throw new Error(`Could not get user: ${response.message}`);
    }

    return User.fromDto(response.user)
  }
}