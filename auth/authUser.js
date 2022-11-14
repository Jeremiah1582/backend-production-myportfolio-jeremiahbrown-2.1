const jwt = require("jsonwebtoken");
const secret = process.env.ACCESSTOKEN_SECRET;
const refreshSecret = process.env.REFRESHTOKEN_SECRET;

exports.authenticateToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (typeof bearerHeader !== "undefined") {
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.session.token = bearerToken;

    jwt.verify(req.session.token, secret, (err, payload) => {
      if (!err && !payload) {
        console.log("authUser: !err && !payload");
        console.log("403: authUser L:17: unauthorised access");
      } else if (err) {
        console.log("authUser L:19: err", err);

        res.status(403).send(err);
      } else if (payload) {
        req.session.jwtPayload = payload;
        next();
      }
    });
  } else {
    console.log(
      "failed to Authorize: no BearerHeader provided in request , or, BearerHeader is equal to undefined "
    );
  }
};
