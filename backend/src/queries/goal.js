import { generateID } from "../helpers/db";

export function insert({ name, date, isCompleted, color, userId }) {
  const query =
    'INSERT INTO goals("id","name","date","isCompleted","color", "userId") VALUES($1,$2,$3,$4,$5,$6) RETURNING *;';
  const dataArr = [generateID(), name, date, isCompleted, color, userId];
  return {
    query,
    dataArr,
  };
}

export function get(userId) {
  const query = 'SELECT * FROM goals WHERE "userId"=$1;';
  const dataArr = [userId];
  return {
    query,
    dataArr,
  };
}
