import { ServerFacade } from "../../src/net/ServerFacade";
import { CreateUserRequest, PagedUserItemRequest, TweeterRequest } from "tweeter-shared";
import "isomorphic-fetch";

describe("ServerFacade", () => {

  let serverFacade: ServerFacade;

  beforeEach(() => {
    serverFacade = new ServerFacade();
  });

  describe("register", () => {
    it("should register user", async () => {
      const request: CreateUserRequest = {
        firstName: "Bilbo",
        lastName: "Baggins",
        alias: "@bilbo",
        password: "myprecious",
        userImageBytes: "asdfgq3p9484pdojkfjp9ldckjasd;kjldfjl;kdf",
        imageFileExtension: ".png",
        token: "",
        userAlias: "",
      }

      const [user, authToken] = await serverFacade.register(request);

      expect(user).not.toBe(null);
      expect(authToken).not.toBe(null);
    });
  });

  describe("getFollowers", () => {
    it("should return list of followers", async () => {
      const request: PagedUserItemRequest = {
        token: "asdfasdg",
        userAlias: "@bilbo",
        pageSize: 10,
        lastItem: null
      }

      const [items, hasMore] = await serverFacade.getUsers("follower", request);

      expect(items).not.toBe(null);
      expect(items.length).toBe(10);
      expect(hasMore).not.toBe(null);
      expect(hasMore).toBe(true);
    });
  });

  describe("getFolloweesCount", () => {
    it("should return count of followees", async () => {
      const request: TweeterRequest = {
        token: "asdfasd",
        userAlias: "@bilbo",
      }

      const count = await serverFacade.getFolloweeCount(request);

      expect (count).not.toBe(null);
    });
  });

  describe("getFollowersCount", () => {
    it("should return count of followers", async () => {
      const request: TweeterRequest = {
        token: "asdfasd",
        userAlias: "@bilbo",
      }

      const count = await serverFacade.getFollowerCount(request);

      expect (count).not.toBe(null);
    });
  });
});