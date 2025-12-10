import { StatusDto } from "../../../dto/StatusDto";

export interface FeedBatchProcessorRequest {
  statusDto: StatusDto;
  followerAliases: string[];
}