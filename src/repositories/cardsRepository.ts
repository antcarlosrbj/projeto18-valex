import { connection } from "./../config/database.js";

export async function find() {
  const result = await connection.query(
    `
      SELECT * 
      FROM users;
    `
  );
  return result.rows;
}
