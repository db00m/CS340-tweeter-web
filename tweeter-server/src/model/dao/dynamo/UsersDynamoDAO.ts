import { UsersDAO } from "../../service/interfaces/UsersDAO";
import { StatusDto, UserDto } from "tweeter-shared";
import {
  BatchWriteCommand,
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand, QueryCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

/*
Schema:
{
  firstName: string,
  lastName: string,
  alias: string,
  passwordHash: string,
  avatarUrl: string
}
 */

export class UsersDynamoDAO implements UsersDAO {
  private tableName = "users";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putUser(user: UserDto, passwordHash: string): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: { ...user, passwordHash }
    });

    await this.client.send(command);
  }

  async getUser(userAlias: string): Promise<UserDto | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        alias: userAlias
      }
    });

    const result = await this.client.send(command);
    if (!result.Item) {
      return null;
    }

    return result.Item as UserDto;
  }
}