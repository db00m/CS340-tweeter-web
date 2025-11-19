import "isomorphic-fetch";
import { StatusService } from "../../src/model.service/StatusService";
import { AuthToken } from "tweeter-shared";

describe ("StatusService", () => {

  let service: StatusService;
  let authToken: AuthToken;

  beforeEach(() => {
    service = new StatusService();
    authToken = AuthToken.Generate();
  })

  describe("LoadMoreStatuses", () => {
    describe("feed", () => {
      const statusType = "feed";

      it ("should return the feed statuses", async () => {
        const [statuses, hasMore] = await service.loadMoreStatuses(authToken, "@bilbo", 10, null, statusType);

        expect(statuses.length).toBeGreaterThan(0);
        expect(hasMore).toBe(true);
      });
    });

    describe("story", () => {
      const statusType = "story";

      it ("should return the story statuses", async () => {
        const [statuses, hasMore] = await service.loadMoreStatuses(authToken, "@bilbo", 10, null, statusType);

        expect(statuses.length).toBeGreaterThan(0);
        expect(hasMore).toBe(true);
      });
    });
  });
});