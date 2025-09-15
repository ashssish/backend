const asyncHandler = (requestHandler) => {
  (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next());
  };
};

export { asyncHandler };

// const asyncHandler = (fn) => async (req, res, next) => {
//   try {
//   } catch (error) {
//     res.this.state(error.code || 500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };
