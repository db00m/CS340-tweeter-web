import { FollowsDynamoDAO } from "../model/dao/dynamo/FollowsDynamoDAO";
import { UsersDynamoDAO } from "../model/dao/dynamo/UsersDynamoDAO";
import { UserDto } from "tweeter-shared";
import { PasswordService } from "../model/service/PasswordService";

const main = async () => {
  const followDAO = new FollowsDynamoDAO();
  const userDAO = new UsersDynamoDAO();
  const passwordService = new PasswordService();

  let users: UserDto[] = []
  const passwordHash = await passwordService.hashPassword("password");

  for (let i = 7579; i < 10_000; i++) {
    const index = i.toString();
    users.push({
      firstName: index,
      lastName: index,
      alias: `@${index}`,
      imageUrl: "https://picsum.photos/500/500",
      passwordHash
    })
  }

  await followDAO.bulkCreateFollowsForFollowee("@Ivan", users.map((user) => user.alias ));
}

main().then(() => console.log("Completed"))


