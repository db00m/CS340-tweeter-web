import { UserDto } from "../../../dto/UserDto";
import { TweeterRequest } from "../TweeterRequest";

export interface PagedUserItemRequest extends TweeterRequest {
  readonly pageSize: number;
  readonly lastItem: UserDto | null;
}