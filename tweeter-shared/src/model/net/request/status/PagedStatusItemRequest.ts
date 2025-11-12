import { UserDto } from "../../../dto/UserDto";
import { TweeterRequest } from "../TweeterRequest";
import { StatusDto } from "../../../dto/StatusDto";

export interface PagedStatusItemRequest extends TweeterRequest {
  readonly pageSize: number;
  readonly lastItem: StatusDto | null;
}