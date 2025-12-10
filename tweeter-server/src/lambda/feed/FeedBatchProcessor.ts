import { FeedBatchProcessorRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { SQSEvent, SQSHandler } from "aws-lambda";
import { SQSFeedQueueAdapter } from "../../model/dao/sqs/SQSFeedQueueAdapter";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const service = new StatusService(new DynamoDAOFactory(), new SQSFeedQueueAdapter());

  for (const record of event.Records) {
    const { statusDto, followerAliases }: FeedBatchProcessorRequest = JSON.parse(record.body);

    await service.appendToFeeds(statusDto, followerAliases);
  }
}
