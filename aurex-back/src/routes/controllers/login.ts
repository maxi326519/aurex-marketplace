import { UserRol, UserStatus, UserTS } from "../../interfaces/UserTS";
import { setUser } from "./users";
import { User } from "../../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (
  email: string,
  password: string,
  rol: UserRol
) => {
  const user: UserTS = {
    name: "Usuario",
    email,
    rol,
    password,
    status:
      rol === UserRol.CLIENT
        ? UserStatus.ACTIVE
        : rol === UserRol.SELLER
        ? UserStatus.WAITING
        : UserStatus.WAITING,
  };
  const newUser = await setUser({ ...user });

  const { currentPassword, ...userData } = newUser.dataValues;
  return userData;
};

export const loginUser = async (email: string, password: string) => {
  // Check parameneters
  if (!email) throw new Error("missin parameter 'email'");
  if (!password) throw new Error("missin parameter 'password'");

  // Search the user by email
  const userModel = await User.findOne({ where: { email: email } });
  const userData: UserTS = userModel?.dataValues as UserTS;

  // Check if the user exist
  if (!userData) throw new Error("User not found");

  // Verify if the user is current available
  if (userData.status === UserStatus.BLOCKED)
    throw new Error("This user is not allowed access");

  // Check the password with bcrypt
  const isPasswordValid = await bcrypt.compare(password, userData.password!);

  // Check if password exist
  if (!isPasswordValid) throw new Error("Incorrect password");

  // Generate the token
  const secretKey = process.env.SECRET_KEY;
  if (!secretKey) throw new Error("Missing secret key");
  const token = jwt.sign({ userId: userData.id }, secretKey, {
    expiresIn: "7d",
  });

  // Response with th user data and token
  return { token, user: userData };
};
