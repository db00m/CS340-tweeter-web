import { StoryDAO } from "../../service/interfaces/StoryDAO";
import { StatusDto } from "tweeter-shared";
import { QueryCommand, PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

export class StoryDynamoDAO implements StoryDAO {

  private readonly client = DynamoDBDocumentClient.from(new DynamoDBClient());

  async addToStory(status: StatusDto): Promise<void> {
    const command = new PutCommand({
      TableName: "stories",
      Item: {
        userAlias: status.user.alias,
        ...status
      }
    });

    await this.client.send(command);
  }

  async getPaginatedStory(userAlias: string, pageSize: number, lastItem: StatusDto | null): Promise<[StatusDto[], boolean]> {
    const command = new QueryCommand({
      TableName: "stories",
      ExpressionAttributeValues: {
        userAlias
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
      return item as StatusDto;
    });

    return [items, hasMore];
  }
}