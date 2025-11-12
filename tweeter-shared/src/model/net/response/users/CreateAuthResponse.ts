import { TweeterResponse } from "../TweeterResponse";
import { UserDto } from "../../../dto/UserDto";
import { AuthToken } from "../../../domain/AuthToken";
import { AuthTokenDto } from "../../../dto/AuthTokenDto";

export interface CreateAuthResponse extends TweeterResponse {
  readonly user: UserDto | null;
  readonly authToken: AuthTokenDto | null;
}