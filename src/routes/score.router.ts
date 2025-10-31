import express from "express";
import { scoreCalculator } from "../controller/score.controller";

const router = express.Router();

router.post("/", scoreCalculator);

export default router;
