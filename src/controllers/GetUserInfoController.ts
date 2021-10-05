import { Request, Response } from 'express';
import { createConnection } from '../postgres';
import { getRedis } from '../redisConfig';

export class GetUserInfoController {
  async handle(request: Request, response: Response) {
    const { userId } = request;

    const clientConnection = await createConnection();

    console.time();

    const userRedis = await getRedis(`user-${userId}`);
    let user = JSON.parse(userRedis);

    if (!userRedis) {
      const { rows } = await clientConnection.query(
        `SELECT * FROM USERS WHERE ID = $1 LIMIT 1`,
        [userId]
      );
      user = rows[0];
    }

    console.timeEnd();

    return response.json(user);
  }
}
