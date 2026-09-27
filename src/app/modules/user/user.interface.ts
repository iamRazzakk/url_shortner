import { Model, Types } from "mongoose";
import { USER_ROLES } from "../../../enums/user";
// Stripe account related sub-document

// Main User interface
export type IUser = {
  name: string;
  role: USER_ROLES;
  email: string;
  password: string;
  profile: string;
  verified: boolean;
  isBanned: boolean;
};

export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isAccountCreated(id: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
} & Model<IUser>;
