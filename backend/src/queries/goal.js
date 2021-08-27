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

export function update({ name, date, isCompleted, color, id, userId }) {
  const query =
    'UPDATE goals SET "name"=$1, "date"=$2, "isCompleted"=$3, "color"=$4 WHERE "id"=$5 AND "userId"=$6 RETURNING *;';
  const dataArr = [name, date, isCompleted, color, id, userId];
  return {
    query,
    dataArr,
  };
}

export function remove({ id, userId }) {
  const query = 'DELETE FROM goals WHERE "id"=$1 AND "userId"=$2 RETURNING *;';
  const dataArr = [id, userId];
  return {
    query,
    dataArr,
  };
}
