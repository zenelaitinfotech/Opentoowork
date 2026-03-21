import express from "express";
import multer from "multer";
import {
  uploadExcel,
  getExcel,
  updateExcel,
  downloadExcel,
} from "../controllers/excelController.js";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/upload", upload.single("file"), uploadExcel);
router.get("/:id", getExcel);
router.put("/:id", updateExcel);
router.get("/:id/download", downloadExcel);

export default router;