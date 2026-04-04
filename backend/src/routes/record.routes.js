import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { autorizedRoles } from "../middleware/role.middleware.js";
import {createRecordController,deleteRecordController,getRecordsController,getRecordByIdController,updateRecordController,} from "../controllers/record.controller.js";
const router=express.Router();

router.post("/", protectRoute,autorizedRoles("admin"),createRecordController);
router.get("/",protectRoute,autorizedRoles("admin","analyst"),getRecordsController);
router.get("/:id",protectRoute,autorizedRoles("admin","analyst"),getRecordByIdController);
router.put("/:id",protectRoute,autorizedRoles("admin"),updateRecordController);
router.delete("/:id",protectRoute,autorizedRoles("admin"),deleteRecordController);

export default router;