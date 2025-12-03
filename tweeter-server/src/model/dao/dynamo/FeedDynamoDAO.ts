import { FeedDAO } from "../../service/interfaces/FeedDAO";
import { StatusDto } from "tweeter-shared";
import { QueryCommand, PutCommand, DynamoDBDocumentClient, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

const BATCH_SIZE = 25;

export class FeedDynamoDAO implements FeedDAO {

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addToFeed(feedOwnerAlias: string, status: StatusDto): Promise<void> {
    const command = new PutCommand({
      TableName: "feed",
      Item: {
        userAlias: status.user.alias,
        ...status
      }
    });

    await this.client.send(command);
  }

  async batchAddToFeed(feedOwnerAliases: string[], status: StatusDto): Promise<void> {
    const putRequests = feedOwnerAliases.map((userAlias) => {
      return {
        PutRequest: {
          Item: {
            status,
            createdAt: status.createdAt,
            userAlias
          }
        }
      }
    });

    const batches = []
    for (let i = 0; i < putRequests.length; i+=BATCH_SIZE) {
      batches.push(putRequests.slice(i, i + BATCH_SIZE));
    }

    for (let i = 0; i < batches.length; i++) {
      const command = new BatchWriteCommand({
        RequestItems: {
          "feed": batches[i]
        }
      });

      await this.client.send(command);
    }
  }

  async getPaginatedFeed(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    // TODO: THis is very similar to story logic, refactor to remove duplication
    const command = new QueryCommand({
      TableName: "feed",
      KeyConditionExpression: "userAlias = :v",
      ExpressionAttributeValues: {
        ":v": userAlias,
      },
      Limit: pageSize,
      ExclusiveStartKey: lastItem ? {
        userAlias,
        createdAt: lastItem.createdAt,
      } : undefined
    });

    const result = await this.client.send(command);
    const hasMore = result.LastEvaluatedKey !== undefined;

    if (result.Items === undefined) {
      return [[], false];
    }

    const items: StatusDto[] = result.Items.map((item) => {
      return item["status"] as StatusDto;
    });

    return [items, hasMore];
  }
}