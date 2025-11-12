import { TweeterResponse } from "../TweeterResponse";
import { UserDto } from "../../../dto/UserDto";

export interface GetUserResponse extends TweeterResponse {
  readonly user: UserDto | null;
}