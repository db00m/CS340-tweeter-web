import { FollowsDAO } from "../../service/interfaces/FollowsDAO";
import { FollowDto } from "tweeter-shared";
import { DeleteCommand, DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const BATCH_SIZE = 25;

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
      Limit: pageSize,
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
      Limit: pageSize,
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

  async bulkCreateFollowsForFollowee(followeeAlias: string, followerAliases: string[]): Promise<void> {
    if (!followerAliases || followerAliases.length === 0) return;

    const putRequests = followerAliases.map(followerAlias => ({
      PutRequest: {
        Item: {
          followerAlias,
          followeeAlias
        }
      }
    }));

    const batches: any[] = [];
    for (let i = 0; i < putRequests.length; i += BATCH_SIZE) {
      batches.push(putRequests.slice(i, i + BATCH_SIZE));
    }

    for (let i = 0; i < batches.length; i++) {
      const command = new BatchWriteCommand({
        RequestItems: {
          "follows": batches[i]
        }
      });

      await this.client.send(command);
    }
  }
}