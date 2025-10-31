import { Router } from "express";
import { getResults, exportResults } from "../controller/results.controller";

const router = Router();

router.get("/", getResults);
router.get("/export", exportResults);

export default router;
