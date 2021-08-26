import * as db from "../src/helpers/db";

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
