import * as User from "../queries/user";
import * as db from "../helpers/db";
import * as Response from "../helpers/response";
import bcrypt from "bcrypt";
import * as Regex from "../helpers/regex";
import * as Session from "../queries/session";
import * as JWT from "../helpers/jwt";

const errors = {
  DB_ERROR: "Unable to insert into database",
  INVALID_ACCOUNT: "Email or password provided is incorrect.",
};

export default async function Login(request, response) {
  try {
    const { email, password } = checkData(request.body);
    if (email.length === 0) {
      return Response.error(response, "INVALID_ACCOUNT", errors);
    }
    if (password.length === 0) {
      return Response.error(response, "INVALID_ACCOUNT", errors);
    }
    if (Regex.checkValidEmail(email) === false) {
      return Response.error(response, "INVALID_ACCOUNT", errors);
    }
    const userObject = User.get(email);
    const user = await db
      .query(userObject.query, userObject.dataArr)
      .then((rows) => rows[0]);
    if (user == null) {
      return Response.error(response, "INVALID_ACCOUNT", errors);
    }
    const isValidPassword = await comparePassword(password, user.password);
    if (isValidPassword === false) {
      return Response.error(response, "INVALID_ACCOUNT", errors);
    }
    const sessionObject = Session.insert(user.id);
    const session = await db.query(sessionObject.query, sessionObject.dataArr);

    if (session.length < 1) {
      Response.error(response, "DB_ERROR", errors);
    }
    const jwt = JWT.issue(session.id, user.id);

    return Response.success(response, { id: user.id, email: user.id, jwt });
  } catch (error) {
    Response.error(response, "DB_ERROR", errors);
  }
}

async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

const checkData = (data) => ({
  email: data.email ? String(data.email).trim().toLowerCase() : "",
  password: data.password ? String(data.password).trim() : "",
});
