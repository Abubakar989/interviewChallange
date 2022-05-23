const Joi = require("joi");




const schemas = {
  email: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.required(),
  }),
  emailAndUserName: Joi.object().keys({
    email: Joi.string().required().email(),
    userName: Joi.string().required(),
  })

  // define all the other schemas below
};
module.exports = schemas;

// module.exports = {
//   forgotPassword,
//   resetPassword,
//   verifyEmail,
//   is_toc,
// };
