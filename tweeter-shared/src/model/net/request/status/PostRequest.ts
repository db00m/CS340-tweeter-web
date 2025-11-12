import { TweeterRequest } from "../TweeterRequest";
import { StatusDto } from "../../../dto/StatusDto";

export interface PostRequest extends TweeterRequest {
  newStatus: StatusDto;
}