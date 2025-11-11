import { TweeterResponse } from "../TweeterResponse";

export interface FollowStatusResponse extends TweeterResponse {
  readonly isFollower: boolean;
}