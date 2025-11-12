import { PostRequest, TweeterResponse } from "tweeter-shared";
import { StatusService } from "../../model/service/StatusService";

export const handler = async ({ token, userAlias, newStatus }: PostRequest): Promise<TweeterResponse> => {
  const statusService = new StatusService();

  await statusService.postStatus(token, newStatus);

  return { success: true, message: null }
}