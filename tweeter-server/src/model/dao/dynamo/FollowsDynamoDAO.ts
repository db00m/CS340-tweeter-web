import { FollowsDAO } from "../../service/interfaces/FollowsDAO";
import { FollowDto, UserDto } from "tweeter-shared";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
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
    return Promise.resolve(undefined);
  }

  async getFollow(followerAlias: string, followeeAlias: string): Promise<FollowDto | null> {
    return Promise.resolve(null);
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

  async getPaginatedFollowees(followerAlias: string): Promise<[items: UserDto[], hasMore: boolean]> {
    return Promise.resolve([[], false]);
  }

  async getPaginatedFollowers(followeeAlias: string): Promise<[items: UserDto[], hasMore: boolean]> {
    // Need to make 2 queries, one to get followee aliases and one to get user data from aliases
    return Promise.resolve([[], false]);
  }

}