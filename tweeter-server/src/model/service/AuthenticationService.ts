import { SessionsDAO } from "./interfaces/SessionsDAO";
import { SessionDto } from "tweeter-shared";

export class AuthenticationService {

  constructor(private readonly sessionsDAO: SessionsDAO) {
  }

  async authenticate(token: string): Promise<void> {
    const session: SessionDto | null = await this.sessionsDAO.getSession(token)

    if (!session) throw Error('Unauthorized');
    if (session.timestamp > Date.now()) {
      await this.sessionsDAO.deleteSession(token);
      throw Error('Unauthorized');
    }
  }
}