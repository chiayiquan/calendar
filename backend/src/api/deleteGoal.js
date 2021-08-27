import * as db from "../helpers/db";
import * as Response from "../helpers/response";
import * as JWT from "../helpers/jwt";
import * as Goal from "../queries/goal";

const errors = {
  ...JWT.jwtError,
  DB_ERROR: "Unable to delete from database",
  INSUFFICIENT_PERMISSION:
    "You do not have the permission to delete this goal.",
};

export default async function DeleteGoal(request, response) {
  try {
    const jwtObject = await JWT.verify(request).catch((err) => err.message);
    if (typeof jwtObject === "string") {
      return Response.error(response, jwtObject, errors);
    }
    const { id } = request.params;
    const goalObject = Goal.remove({ id, userId: jwtObject.userId });
    const deletedGoal = await db.query(goalObject.query, goalObject.dataArr);
    if (deletedGoal.length > 0) {
      return Response.success(response, id);
    } else {
      return Response.error(response, "INSUFFICIENT_PERMISSION", errors);
    }
  } catch (error) {
    Response.error(response, "DB_ERROR", errors);
  }
}
