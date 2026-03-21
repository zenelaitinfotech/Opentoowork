import fs from "fs";
import XLSX from "xlsx";
import ExcelFile from "../models/ExcelFile.js";

// ================= AUTO STATUS FUNCTION =================
const getStatus = (stock) => {
  if (stock < 0) return "Low";
  if (stock > 3000) return "High";
  return "Normal";
};

// ================= UPLOAD EXCEL =================
export const uploadExcel = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    if (!jsonData.length) {
      return res.status(400).json({ message: "Excel is empty" });
    }

    const headers = Object.keys(jsonData[0]);

    const excel = await ExcelFile.create({
      fileName: req.file.originalname,
      headers,
      rows: jsonData,
    });

    // optional: remove uploaded temp file
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      message: "Uploaded successfully",
      id: excel.id,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({ message: "Upload failed" });
  }
};

// ================= GET EXCEL =================
export const getExcel = async (req, res) => {
  try {
    const file = await ExcelFile.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (error) {
    console.log("GET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE EXCEL =================
export const updateExcel = async (req, res) => {
  try {
    const { rows } = req.body;

    if (!rows) {
      return res.status(400).json({ message: "Rows missing" });
    }

    const updatedRows = rows.map((row) => ({
      ...row,
      STATUS: getStatus(Number(row.STOCK || 0)),
    }));

    const file = await ExcelFile.findByPk(req.params.id);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const updatedFile = await file.update({ rows: updatedRows });

    res.json({
      message: "Updated successfully",
      data: updatedFile,
    });

  } catch (error) {
    console.log("UPDATE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= DOWNLOAD EXCEL =================
export const downloadExcel = async (req, res) => {
  try {
    const file = await ExcelFile.findByPk(req.params.id);

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const worksheet = XLSX.utils.json_to_sheet(file.rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const buffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${file.fileName}`
    );
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.send(buffer);

  } catch (error) {
    console.log("DOWNLOAD ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};