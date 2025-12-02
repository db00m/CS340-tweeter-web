import { SessionsDAO } from "../../service/interfaces/SessionsDAO";
import { AuthTokenDto, SessionDto } from "tweeter-shared";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  DeleteCommand
} from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class SessionsDynamoDAO implements SessionsDAO {
  private tableName = "sessions";

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createSession(userAlias: string, authToken: AuthTokenDto): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: {
        userAlias,
        authToken: authToken.token,
        timestamp: authToken.timestamp,
      }
    });

    await this.client.send(command);
  }

  async deleteSession(authToken: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: {
        authToken
      }
    });

    await this.client.send(command);
  }

  async getSession(token: string): Promise<SessionDto | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        authToken: token,
      }
    });

    const result = await this.client.send(command);

    if (!result.Item) return null;

    return result.Item as SessionDto;
  }

}