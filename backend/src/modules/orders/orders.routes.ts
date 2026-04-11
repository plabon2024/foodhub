
import { Router } from "express";
import { createOrderController, getMyOrdersController, getOrderDetailsController } from "./orders.controller";


const router = Router();

router.post("/", createOrderController);
router.get("/", getMyOrdersController);
router.get("/:id", getOrderDetailsController);

export const orderRoutes = router;
