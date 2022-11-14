const jwt = require("jsonwebtoken");
const secret = process.env.ACCESSTOKEN_SECRET;
const refreshSecret = process.env.REFRESHTOKEN_SECRET;

exports.generateToken = (userId) => {
  return jwt.sign({ userId }, secret, { expiresIn: 300000 * 5 });
};

exports.refreshToken = (userId) => {
  return jwt.sign({ userId }, refreshSecret);
};
