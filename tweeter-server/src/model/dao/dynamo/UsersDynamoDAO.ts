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

export class UsersDynamoDAO implements UsersDAO {
  private tableName = "users";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async putUser(user: UserDto, passwordHash: string): Promise<void> {
    // TODO: Save Avatar in S3 Bucket
    const command = new PutCommand({
      TableName: this.tableName,
      Item: { ...user, passwordHash }
    });

    await this.client.send(command);
  }

  getUser(userAlias: string): Promise<StatusDto | null> {
    return Promise.resolve(null);
  }
}