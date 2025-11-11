import { TweeterRequest } from "../TweeterRequest";
import { UserDto } from "../../../dto/UserDto";

export interface FollowActionRequest extends TweeterRequest {
  subjectUser: UserDto
}