import { FeedBatcherRequest, FeedBatchProcessorRequest } from "tweeter-shared";

export interface FeedQueueAdapter {
  appendToBatcherQueue(request: FeedBatcherRequest): Promise<void>
  appendToBatchProcessorQueue(request: FeedBatchProcessorRequest): Promise<void>
}