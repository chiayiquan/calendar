import * as JWT from "jsonwebtoken";

export function issue(sessionId, userId) {
  return JWT.sign({ sessionId, userId }, process.env.JWT_SECRET);
}
