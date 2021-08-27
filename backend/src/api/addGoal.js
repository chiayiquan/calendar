import * as db from "../helpers/db";
import * as Response from "../helpers/response";
import * as JWT from "../helpers/jwt";
import * as Goal from "../queries/goal";
import moment from "moment";
import * as Regex from "../helpers/regex";

const errors = {
  ...JWT.jwtError,
  DB_ERROR: "Unable to insert into database",
  INVALID_NAME: "Name cannot be empty.",
  INVALID_DATE: "Date cannot be empty.",
  INVALID_STATUS: "Invalid status type.",
  INVALID_COLOR: "Invalid color.",
};

export default async function AddGoal(request, response) {
  try {
    const jwtObject = await JWT.verify(request).catch((err) => err.message);
    if (typeof jwtObject === "string") {
      return Response.error(response, jwtObject, errors);
    }
    const data = checkData(request.body);
    if (data.name == null) {
      return Response.error(response, "INVALID_NAME", errors);
    }

    if (data.date == null) {
      return Response.error(response, "INVALID_DATE", errors);
    }

    if (data.isCompleted == null) {
      return Response.error(response, "INVALID_STATUS", errors);
    }

    if (data.color == null) {
      return Response.error(response, "INVALID_COLOR", errors);
    }

    const goalObject = Goal.insert({ ...data, userId: jwtObject.userId });
    const goal = await db
      .query(goalObject.query, goalObject.dataArr)
      .then((rows) => rows[0]);
    return Response.success(response, goal);
  } catch (error) {
    Response.error(response, "DB_ERROR", errors);
  }
}

const checkData = (data) => ({
  name:
    data.name != null && String(data.name).trim().length > 0
      ? String(data.name).trim()
      : null,
  date:
    data.date != null &&
    String(data.date).trim().length > 0 &&
    moment(String(data.date).trim(), "YYYY-MM-DD", true).isValid()
      ? String(data.date).trim()
      : null,
  isCompleted:
    data.isCompleted != null &&
    typeof JSON.parse(data.isCompleted) === "boolean"
      ? JSON.parse(data.isCompleted)
      : null,
  color:
    data.color != null &&
    String(data.color).trim().length > 0 &&
    Regex.checkValidColor(String(data.color))
      ? String(data.color).trim()
      : null,
});
