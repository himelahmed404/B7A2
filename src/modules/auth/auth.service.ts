import { pool } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import config from "../../config";

const loginUserIntoDB = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  const checkMail = await pool.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  console.log("checkMail", checkMail);
  if (checkMail.rows.length === 0) {
    throw new Error("Invalid email or password");
  }

  const user = checkMail.rows[0];

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    throw new Error("Invalid email or password");
  }

  //JWT

  const jwtPayload = {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });

  delete user.password;

  return {
    accessToken,
    user,
  };
};

export const AuthService = {
  loginUserIntoDB,
};
