import * as User from "../queries/user";
import * as db from "../helpers/db";
import * as Response from "../helpers/response";
import bcrypt from "bcrypt";
import * as Regex from "../helpers/regex";

const errors = {
  DB_ERROR: "Unable to insert into database",
  INVALID_EMAIL: "Invalid email.",
  INVALID_PASSWORD: "Password cannot be empty.",
};

export default async function Register(request, response) {
  try {
    const { email, password } = checkData(request.body);
    if (email.length === 0) {
      return Response.error(response, "INVALID_EMAIL", errors);
    }
    if (password.length === 0) {
      return Response.error(response, "INVALID_PASSWORD", errors);
    }
    if (Regex.checkValidEmail(email) === false) {
      return Response.error(response, "INVALID_EMAIL", errors);
    }
    const hashedPassword = await hashPassword(password);
    const queryObj = User.insert({
      email,
      password: hashedPassword,
    });
    await db.query(queryObj.query, queryObj.dataArr);
    return Response.success(response, "Successfully created account.");
  } catch (error) {
    Response.error(response, "DB_ERROR", errors);
  }
}

async function hashPassword(password) {
  return bcrypt.hash(password, 11);
}

const checkData = (data) => ({
  email: data.email ? String(data.email).trim().toLowerCase() : "",
  password: data.password ? String(data.password).trim() : "",
});
