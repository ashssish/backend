import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHndler } from "../utils/asyncHndler.js";
// import dotenv from "dotenv";
import { User } from "../models/user.model.js";

// dotenv.config();

export const verifyJWT = asyncHndler(async (req, _, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized Request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new ApiError(401, "Invailid Access Token");
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "invailid access token");
  }
});
