import { TweeterRequest } from "../TweeterRequest";
import { UserDto } from "../../../dto/UserDto";

export interface FollowStatusRequest extends TweeterRequest {
  readonly selectedUser: UserDto
}