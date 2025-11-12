import { TweeterRequest } from "../TweeterRequest";

export interface CreateAuthRequest extends TweeterRequest {
  readonly password: string;
  readonly alias: string;
}