import express from "express";
import multer from "multer";
import { uploadLeads } from "../controller/lead.controller";

const router = express.Router();

// configure multer to store files in uploads/ with original filename (or random)
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

router.post("/upload", upload.single("file"), uploadLeads);

export default router;
