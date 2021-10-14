const { verifySignUp } = require("../middlewares");
const controller = require("../controllers/auth.controller");
const validate = require("../validation/auth.validation");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [verifySignUp.checkDuplicateUsernameOrEmail],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);

  app.post("/api/auth/forget-password", controller.forgotPassword);

  app.post("/api/auth/reset-password", controller.resetPassword);
};
