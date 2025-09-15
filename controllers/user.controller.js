import { asyncHndler } from "../utils/asyncHndler.js";

const registerUser = asyncHndler(async (requestAnimationFrame, res) => {
  res.status(200).json({
    message: "ok",
  });
});

export { registerUser };
