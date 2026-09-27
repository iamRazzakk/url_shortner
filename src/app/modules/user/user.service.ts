import { USER_ROLES } from "../../../enums/user";
import { IUser } from "./user.interface";
import { JwtPayload } from "jsonwebtoken";
import { User } from "./user.model";
import { StatusCodes } from "http-status-codes";
import ApiError from "../../../errors/ApiErrors";
import generateOTP from "../../../util/generateOTP";
import { emailTemplate } from "../../../shared/emailTemplate";
import { emailProducer } from "../../../services/email.producer";
import { logger } from "../../../shared/logger";
import crypto from "crypto";
import redisClient from "../../../config/redis.config";
import worker from "../../../worker/email.worker";
import { dataStoreToRedis } from "../../redis/redis.service";

const createAdminToDB = async (payload: any): Promise<IUser> => {
  // check admin is exist or not;
  const isExistAdmin = await User.findOne({ email: payload.email });
  if (isExistAdmin) {
    throw new ApiError(StatusCodes.CONFLICT, "This Email already taken");
  }

  // create admin to db
  const createAdmin = await User.create(payload);
  if (!createAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Admin");
  } else {
    await User.findByIdAndUpdate(
      { _id: createAdmin?._id },
      { verified: true },
      { new: true },
    );
  }

  return createAdmin;
};

const createUserToDB = async (payload: Partial<IUser>): Promise<IUser> => {
  const createUser = await User.create(payload);
  if (!createUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }
  payload.verified = true;

  //send email
  const otp = generateOTP();
  const values = {
    name: createUser.name,
    otp: otp,
    email: createUser.email!,
  };

  const emailJobId = crypto.randomUUID();
  const createAccountTemplate = emailTemplate.createAccount(values);
  // need to use bullmq to send email
  // const result = await dataStoreToRedis(
  //   `authentication:${createUser.email.toString()}`,
  //   JSON.stringify({
  //     email: createUser?.email,
  //     oneTimeCode: otp,
  //     expireAt: new Date(Date.now() + 3 * 60000),
  //   }),
  //   3 * 60 * 1000,
  // );
  // if (result === null) {
  //   throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to store otp in redis");
  // }
  return createUser;
};

const getUserProfileFromDB = async (
  user: JwtPayload,
): Promise<Partial<IUser>> => {
  const { id } = user;
  const isExistUser: any = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }
  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>,
): Promise<Partial<IUser | null>> => {
  const { id } = user;
  const isExistUser = await User.isExistUserById(id);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  const updateDoc = await User.findOneAndUpdate({ _id: id }, payload, {
    new: true,
  });
  return updateDoc;
};

const createBultUser = async (payload: Partial<IUser>[]) => {
  const createUsers = await User.insertMany(payload);
  if (!createUsers) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }
  return createUsers;
};

export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  createAdminToDB,
  createBultUser,
};
