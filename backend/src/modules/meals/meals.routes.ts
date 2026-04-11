import { Router } from "express";
import { browseMealsController, getMealDetailsController, getProviderWithMenuController, getStatsController, listProvidersController } from "./meals.controller";
import { listCategoryController } from "../category/category.controller";
import { checkAuth } from "../../lib/checkAuth";


const router = Router();

router.get("/meals", browseMealsController);
router.get("/meals/:id", getMealDetailsController);

router.get("/providers", listProvidersController);
router.get("/providers/:id", getProviderWithMenuController);
router.get("/stats", checkAuth("ADMIN", "PROVIDER"), getStatsController);
router.get("/categories", listCategoryController);

export const mealRoutes = router;
