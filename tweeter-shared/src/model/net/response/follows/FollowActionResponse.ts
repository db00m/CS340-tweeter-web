import { TweeterResponse } from "../TweeterResponse";

export interface FollowActionResponse extends TweeterResponse {
  followerCount: number,
  followeeCount: number
}