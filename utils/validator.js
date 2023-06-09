import { body, validationResult } from "express-validator";
import {
  getUserWithEmail,
  getUserWithUsername,
  getUserWithId,
} from "../models/userModels.js";

const validationRules = () => {
  return [
    /**
     * `body([fields, message])`, only checking `req.body`
     * @param {string} field A string or array of strings of field names to validate against
     * @param {string} message An error message to use when validator don't specify a message
     */
    body("username", "Minimum 3 characters")
      .isLength({ min: 3 })
      .custom(async (value, { req }) => {
        //Receives the value of the field being validated, as well as the express `request`, the `location` and the `field path`.
        const userID = req.params.id;

        const [userWithUsername] = await getUserWithUsername(value);

        if (userWithUsername) {
          // only if username already exists

          if (!userID) {
            // if not signed in //when signning up first time
            return Promise.reject("Username already in use");
          } else {
            // if signed in // when updating username
            try {
              const [currentUser] = await getUserWithId(userID); // If defined outside, userID not found and error occoured

              if (currentUser.username == userWithUsername.username) {
                // check if username matches with current user
                return Promise.resolve();
              } else {
                return Promise.reject("Username already in use");
              }
            } catch (e) {}
          }
        }
      })
      .trim() //  Removes whitespace from both sides of a string.
      .escape(),

    body("email")
      .isEmail()
      .custom(async (value, { req }) => {
        const userbyEmail = await getUserWithEmail(value);
        console.log(req.route.methods.put);

        if (!req.route.methods.put) {
          if (userbyEmail) {
            return Promise.reject("email already in use, please change email.");
          }
        }else{
          return Promise.resolve('email updated!')
        }
      })      
      .normalizeEmail(),

    body("password")
      .optional() // Marks the current validation chain as optional, `undefined` values will be ignored from the validation.
      .matches("(?=.*[A-Z]).{5,}")
      .withMessage("Min 5 char with one capital letter"),

    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation does not match password");
      }

      // Indicates the success of this synchronous custom validator
      return true;
    }),
  ];
};

const validate = (req, res, next) => {
  // Extracts the validation errors from a request and wraps them in an object with handy functions
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = [];
    // Extract only the error's param(field) and error message as an object and add them to an array
    errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

    return res.status(400).json({ errors: extractedErrors });
  }
  next();
};

export { validationRules, validate };
