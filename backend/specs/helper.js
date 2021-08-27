import * as db from "../src/helpers/db";
import * as User from "../src/queries/user";
import * as JWT from "../src/helpers/jwt";
import * as Goal from "../src/queries/goal";
import bcrypt from "bcrypt";

export async function cleanDB() {
  const tableQuery =
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public';";
  const tables = await db
    .query(tableQuery, [])
    .then((rows) => rows.flatMap((tableName) => Object.values(tableName)));
  const truncateQuery = `TRUNCATE ${tables.join(",")} RESTART IDENTITY;`;
  return db.query(truncateQuery, []);
}

export async function getUserByEmail(email) {
  const userQuery = `SELECT * FROM users WHERE email='${email}';`;
  return db.query(userQuery, []).then((rows) => rows[0]);
}

export async function createUser(data) {
  const user = {
    email:
      data.email != null
        ? String(data.email).toLowerCase()
        : "test@example.com",
    password:
      data.password != null
        ? await hashPassword(String(data.password))
        : await hashPassword("random-password"),
  };
  const insertQuery = User.insert(user);
  const updatedUser = await db
    .query(insertQuery.query, insertQuery.dataArr)
    .then((rows) => rows[0]);
  const jwt = await JWT.issue(updatedUser.id);
  return { user: updatedUser, jwt };
}

async function hashPassword(password) {
  return bcrypt.hash(password, 11);
}

export async function insertGoal(data) {
  const goalObject = Goal.insert(data);
  return db.query(goalObject.query, goalObject.dataArr).then((rows) => rows[0]);
}
