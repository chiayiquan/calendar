import * as db from "../helpers/db";
import * as Response from "../helpers/response";
import * as JWT from "../helpers/jwt";
import * as Goal from "../queries/goal";

const errors = {
  ...JWT.jwtError,
  DB_ERROR: "Unable to insert into database",
};

export default async function ListGoal(request, response) {
  try {
    const jwtObject = await JWT.verify(request).catch((err) => err.message);
    if (typeof jwtObject === "string") {
      return Response.error(response, jwtObject, errors);
    }
    const goalObject = Goal.get(jwtObject.userId);
    const goals = await db.query(goalObject.query, goalObject.dataArr);

    return Response.success(response, goals);
  } catch (error) {
    Response.error(response, "DB_ERROR", errors);
  }
}
