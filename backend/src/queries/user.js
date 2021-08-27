import { generateID } from "../helpers/db";

export function insert({ email, password }) {
  const query =
    'INSERT INTO users("id","email","password") VALUES($1,$2,$3) RETURNING *;';
  const dataArr = [generateID(), email, password];
  return {
    query,
    dataArr,
  };
}

export function get(email) {
  const query = 'SELECT * FROM users WHERE "email"=$1;';
  const dataArr = [email];
  return {
    query,
    dataArr,
  };
}
