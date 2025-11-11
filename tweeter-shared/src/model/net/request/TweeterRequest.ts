import { UserDto } from "../../dto/UserDto";

export interface TweeterRequest {
  readonly token: string;
  readonly userAlias: string;
}