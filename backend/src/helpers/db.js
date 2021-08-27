import { Pool } from "pg";
import uuid from "uuid-random";
import { dbConfig } from "../configs/dbConfig";

const pool = new Pool(dbConfig);

export const query = async (q, params) => {
  const client = await pool.connect();
  try {
    const result = await client.query(q, params);
    client.release();
    return result.rows;
  } catch (error) {
    throw error;
  }
};

export function generateID() {
  return uuid().replace(/-/g, ""); // remove all the -
}
