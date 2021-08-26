import { generateID } from "../helpers/db";

export function insert({ email, password }) {
  const query =
    "INSERT INTO users(id,email,password) VALUES($1,$2,$3) RETURNING *";
  const dataArr = [generateID(), email, password];
  return {
    query,
    dataArr,
  };
}
