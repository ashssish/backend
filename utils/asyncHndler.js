const asyncHndler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export { asyncHndler };

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//   } catch (error) {
//     res.this.state(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
