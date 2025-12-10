import { FeedBatcherRequest, FeedBatchProcessorRequest } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { SQSFeedQueueAdapter } from "../../model/dao/sqs/SQSFeedQueueAdapter";
import { SQSEvent, SQSHandler } from "aws-lambda";

export const handler: SQSHandler = async (event: SQSEvent) => {
  const service = new StatusService(new DynamoDAOFactory(), new SQSFeedQueueAdapter());

  for (const record of event.Records) {
    const { statusDto, authorAlias }: FeedBatcherRequest = JSON.parse(record.body);

    await service.createBatches(statusDto, authorAlias);
  }
}