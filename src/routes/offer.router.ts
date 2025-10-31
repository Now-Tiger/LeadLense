import express from "express";
import { createOffer } from "../controller/offer.controller"

const router = express.Router();

router.post("/", createOffer)

export default router;
