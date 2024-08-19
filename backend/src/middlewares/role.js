const userModel = require("../models/userModel");

const role = (roles) => {
  return async(req, res, next) => {
    const user_email = req.user.email;
    const user = await userModel.findOne({ email: user_email });

    if (roles.includes(user.role)) {
      next();
    } else {
      return res
        .status(401)
        .json({ message: "you are not authorized to perform this action" });
    }
  };
};

module.exports = role;
