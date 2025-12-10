import { StatusDto } from "../../../dto/StatusDto";

export interface FeedBatcherRequest {
  statusDto: StatusDto;
  authorAlias: string;
}