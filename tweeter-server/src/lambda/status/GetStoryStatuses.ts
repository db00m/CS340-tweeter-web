import { PagedStatusItemRequest, PagedStatusItemResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { SQSFeedQueueAdapter } from "../../model/dao/sqs/SQSFeedQueueAdapter";

export const handler = async ({ token, userAlias, pageSize, lastItem }: PagedStatusItemRequest): Promise<PagedStatusItemResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory(), new SQSFeedQueueAdapter());

  try {
    const [items, hasMore] = await statusService.fetchStoryPage(token, userAlias, pageSize, lastItem);

    return {
      success: true,
      message: null,
      items,
      hasMore
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      items: [],
      hasMore: false
    }
  }
}