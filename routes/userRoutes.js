"use strict";
import express from "express";
import * as controller from "../controllers/userController.js";
import { uploadDestProfile } from "../utils/uploadDest.js";
import { validationRules, validate } from "../utils/validator.js";
import checkAuth from "../utils/checkAuth.js";

const router = express.Router();

router.get("/:id", controller.userWithId);
router.get("/", controller.userSearch);

// add a profile picture
router.post(
  "/profile",
  checkAuth,
  uploadDestProfile.single("profile"),
  controller.uploadProfile
);

router.put("/:id", validationRules(),validate,  checkAuth, controller.updateUserData);


export default router;
