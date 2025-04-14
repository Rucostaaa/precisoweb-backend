// utils/catchAsync.js
export const catchAsync = (fn) => {
  return (req, res, next) => {
    
    fn(req, res, next).catch(next);  // If an error occurs, it will be passed to the next middleware
  };
};
