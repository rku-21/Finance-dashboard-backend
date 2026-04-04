import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { autorizedRoles } from "../middleware/role.middleware.js";
import {getAllusersController,createUserController,getUserbyIdController, updateUserController,deleteUserController,updateUserStatusController,} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", protectRoute, autorizedRoles("admin"), getAllusersController);
router.post("/", protectRoute, autorizedRoles("admin"), createUserController);
router.get("/:id", protectRoute, autorizedRoles("admin"), getUserbyIdController);
router.put("/:id", protectRoute, autorizedRoles("admin"), updateUserController);
router.patch("/:id/status", protectRoute, autorizedRoles("admin"), updateUserStatusController);
router.delete("/:id", protectRoute, autorizedRoles("admin"), deleteUserController);

export default router;
