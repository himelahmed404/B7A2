import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcrypt";

const CreateUserIntoDB = async (payload: IUser) => {
  console.log("payload", payload);
  const { username, email, password, role } = payload;
  const hashedPassword = await bcrypt.hash(password, 12);
  const result = await pool.query(
    `
        INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, COALESCE($4, 'contributor')) RETURNING *
        `,
    [username, email, hashedPassword, role],
  );

  delete result.rows[0].password;
  return result.rows[0];
};

export const UserService = {
  CreateUserIntoDB,
};
