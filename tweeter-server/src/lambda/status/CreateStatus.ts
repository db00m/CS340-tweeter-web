import { PostRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { SQSFeedQueueAdapter } from "../../model/dao/sqs/SQSFeedQueueAdapter";

export const handler = async ({ token, userAlias, newStatus }: PostRequest): Promise<TweeterResponse> => {
  const statusService = new StatusService(new DynamoDAOFactory(), new SQSFeedQueueAdapter());

  try {
    await statusService.postStatus(token, newStatus);

    return { success: true, message: null }
  } catch (error) {

    return { success: false, message: (error as Error).message };
  }

}