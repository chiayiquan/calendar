import { generateID } from "../helpers/db";

export function insert(userId) {
  const query = 'INSERT INTO sessions("id","userId") VALUES($1,$2) RETURNING *';
  const dataArr = [generateID(), userId];
  return {
    query,
    dataArr,
  };
}

export function get(id, userId) {
  const query = 'SELECT * FROM sessions WHERE "id"=$1 AND "userId"=$2;';
  const dataArr = [id, userId];
  return {
    query,
    dataArr,
  };
}
