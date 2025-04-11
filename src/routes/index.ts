import { Router } from "express";
import categoriesRouter from "./categories.route";

const router = Router();

router.use("/category", categoriesRouter);

export default router;
