import { FollowsDAO } from "../../service/interfaces/FollowsDAO";
import { FollowDto, StatusDto, UserDto } from "tweeter-shared";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

// It's okay for this DAO to access more than one table.  The DAO is not an abstraction for the table, but an abstraction
// of the data that is getting fetched.

export class FollowsDynamoDAO implements FollowsDAO {

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async createFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const command = new PutCommand({
      TableName: "follows",
      Item: {
        followerAlias,
        followeeAlias
      }
    });

    await this.client.send(command);
  }

  async deleteFollow(followerAlias: string, followeeAlias: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: "follows",
      Key: {
        followerAlias,
        followeeAlias
      }
    });

    await this.client.send(command);
  }

  async getFollow(followerAlias: string, followeeAlias: string): Promise<FollowDto | null> {
    const command = new GetCommand({
      TableName: "follows",
      Key: {
        followerAlias,
        followeeAlias
      }
    });

    const result = await this.client.send(command);

    if (!result.Item) {
      return null;
    }

    return result.Item as FollowDto;
  }

  async getFolloweeCount(followerAlias: string): Promise<number> {
    const command = new QueryCommand({
      TableName: "follows",
      KeyConditionExpression: "followerAlias = :a",
      ExpressionAttributeValues: {
        ":a": followerAlias
      },
      Select: "COUNT"
    });

    const result = await this.client.send(command);
    return result.Count ?? 0;
  }

  async getFollowerCount(followeeAlias: string): Promise<number> {
    const command = new QueryCommand({
      TableName: "follows",
      IndexName: "follow_index",
      KeyConditionExpression: "followeeAlias = :a",
      ExpressionAttributeValues: {
        ":a": followeeAlias
      },
      Select: "COUNT"
    });

    const result = await this.client.send(command);
    return result.Count ?? 0;
  }

  async getPaginatedFollowees(followerAlias: string, pageSize: number, lastAlias: string | undefined): Promise<[aliases: string[], hasMore: boolean]> {
    const command = new QueryCommand({
      TableName: "follows",
      KeyConditionExpression: "followerAlias = :v",
      ExpressionAttributeValues: {
        ":v": followerAlias
      },
      ExclusiveStartKey: lastAlias ? {
        followerAlias,
        followeeAlias: lastAlias
      } : undefined,
    });

    const result = await this.client.send(command);
    const hasMore = result.LastEvaluatedKey !== undefined;

    if (result.Items === undefined) {
      return [[], false];
    }

    const aliases: string[] = result.Items.map((item) => {
      return item["followeeAlias"];
    });

    return [aliases, hasMore];
  }

  async getPaginatedFollowers(followeeAlias: string, pageSize: number, lastAlias: string | undefined): Promise<[aliases: string[], hasMore: boolean]> {
    // Need to make 2 queries, one to get followee aliases and one to get user data from aliases
    const command = new QueryCommand({
      TableName: "follows",
      IndexName: "follow_index",
      KeyConditionExpression: "followeeAlias = :v",
      ExpressionAttributeValues: {
        ":v": followeeAlias
      },
      ExclusiveStartKey: lastAlias ? {
        followeeAlias,
        followerAlias: lastAlias
      } : undefined,
    });

    const result = await this.client.send(command);
    const hasMore = result.LastEvaluatedKey !== undefined;

    if (result.Items === undefined) {
      return [[], false];
    }

    const aliases: string[] = result.Items.map((item) => {
      return item["followerAlias"];
    });

    return [aliases, hasMore];
  }
}