import { FeedQueueAdapter } from "../../service/interfaces/FeedQueueAdapter";
import { FeedBatcherRequest, FeedBatchProcessorRequest } from "tweeter-shared";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";



export class SQSFeedQueueAdapter implements FeedQueueAdapter {
  private client = new SQSClient({ region: "us-west-2" });

  private batcherQueueUrl = process.env.BATCHER_QUEUE_URL;
  private batchProcessorQueueUrl = process.env.PROCESSER_QUEUE_URL;

  async appendToBatchProcessorQueue(request: FeedBatchProcessorRequest): Promise<void> {
    if (!this.batchProcessorQueueUrl) {
      throw new Error("PROCESSER_QUEUE_URL is missing");
    }

    const command = new SendMessageCommand({
      QueueUrl: this.batchProcessorQueueUrl,
      MessageBody: JSON.stringify(request),
    });

    await this.client.send(command);
  }

  async appendToBatcherQueue(request: FeedBatcherRequest): Promise<void> {
    if  (!this.batcherQueueUrl) {
      throw new Error("BATCHER_QUEUE_URL is missing");
    }

    const command = new SendMessageCommand({
      QueueUrl: this.batcherQueueUrl,
      MessageBody: JSON.stringify(request),
    });

    await this.client.send(command);
  }
}