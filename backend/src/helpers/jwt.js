import * as JWT from "jsonwebtoken";
import * as Session from "../queries/session";
import * as db from "../helpers/db";

const jwtSecret = process.env.JWT_SECRET;
export const jwtError = {
  INVALID_JWT: "Invalid jwt provided.",
  INVALID_SESSION: "No session existed.",
};
export async function issue(userId) {
  try {
    const sessionObject = Session.insert(userId);
    const session = await db.query(sessionObject.query, sessionObject.dataArr);
    if (session.length < 1) {
      throw Error("DB_ERROR");
    }
    return JWT.sign({ sessionId: session[0].id, userId }, jwtSecret);
  } catch (error) {
    throw Error("DB_ERROR");
  }
}

export async function verify(request) {
  try {
    const jwt = getJWTToken(request);
    if (jwt == null) {
      throw Error("INVALID_JWT");
    }
    const { sessionId, userId } = JWT.verify(jwt, jwtSecret);
    const sessionObject = Session.get(sessionId, userId);
    const session = await db.query(sessionObject.query, sessionObject.dataArr);
    if (session.length < 1) {
      throw Error("INVALID_SESSION");
    }
    return { sessionId, userId };
  } catch (error) {
    throw Error("INVALID_JWT");
  }
}

export function getJWTToken(request) {
  const authorization = String(request.header("Authorization"));
  const matches = authorization.match(/Bearer (.*)/);
  const token = matches == null ? null : matches[1];
  return token;
}
