import { CreateAuthResponse, CreateUserRequest } from "tweeter-shared";
import { UserService } from "../../model/service/UserService";
import { DynamoDAOFactory } from "../../model/dao/dynamo/DynamoDAOFactory";
import { S3AvatarDAO } from "../../model/dao/s3/S3AvatarDAO";

export const handler = async (
  { firstName, lastName, alias, password, userImageBytes, imageFileExtension }: CreateUserRequest
): Promise<CreateAuthResponse> => {
  const userService = new UserService(new DynamoDAOFactory(), new S3AvatarDAO());

  try {
    const [user, authToken] = await userService.register(firstName, lastName, alias, password, userImageBytes, imageFileExtension);
    return {
      success: true,
      message: null,
      user: user,
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