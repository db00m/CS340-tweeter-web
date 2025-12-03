import { CreateAuthRequest, CreateAuthResponse } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { S3AvatarDAO } from "../../model/dao/s3/S3AvatarDAO";

export const handler = async ({ alias, password }: CreateAuthRequest): Promise<CreateAuthResponse> => {
  const userService = new UserService(new DynamoDAOFactory(), new S3AvatarDAO());

  try {
    const [user, authToken] = await userService.login(alias, password);

    return {
      success: true,
      message: null,
      user,
      authToken
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
      user: null,
      authToken: null
    }
  }

}