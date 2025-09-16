import { asyncHndler } from "../utils/asyncHndler.js";
import { apiError } from "../utils/apiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { apiResponce } from "../utils/apiResponce.js";

const registerUser = asyncHndler(async (req, res) => {
  /**
   * get user detail from frontend
   * validation - not empity
   * check if user already exist: username,email
   * check for images , check for avtar
   * upload them to cloudinary , avtar check
   * create use object - create entry in db
   * remove password and refresh token field from responce
   * check for user creation
   * return res
   */

  const { fullname, email, username, pasaword } = req.body;
  console.log("email", email);

  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All Fields are required");
  }

  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username allready exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(400, "Avatar file is required");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    pasaword,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-pasaword -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Something went wrong register the user");
  }

  return res
    .status(201)
    .json(new apiResponce(200, createdUser, "User registered Successfully"));
});

export { registerUser };
