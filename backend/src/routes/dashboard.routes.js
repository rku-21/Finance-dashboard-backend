import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { autorizedRoles } from "../middleware/role.middleware.js";
import {categoryWiseTotalsController,dashboardSummaryController,recentActivityController,trendsController,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/summary",protectRoute,autorizedRoles("viewer", "analyst", "admin"),dashboardSummaryController);
router.get("/category-wise-totals",protectRoute,autorizedRoles("viewer", "analyst", "admin"),categoryWiseTotalsController);
router.get("/recent-activity",protectRoute,autorizedRoles("viewer", "analyst", "admin"),recentActivityController);
router.get("/trends",protectRoute,autorizedRoles("viewer", "analyst", "admin"),trendsController);

export default router;
