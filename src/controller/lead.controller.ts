import { Request, Response } from "express";
import fs from "fs/promises";
import { parseCSV } from "../utils/csvParser";
import { saveLeadsToDB } from "../services/lead.service";

/**
 * Expects multipart/form-data with key 'file' containing CSV.
 */
export const uploadLeads = async (req: Request, res: Response) => {
  console.log(`>> [API]: /api/v1/leads/upload`)
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required under field name 'file'" });
  }

  const filePath = req.file.path;

  try {
    const rows = await parseCSV(filePath);

    // Validate required headers present in first row (basic check)
    if (rows.length === 0) {
      // cleanup
      await fs.unlink(filePath).catch(() => {});
      return res.status(400).json({ message: "CSV is empty or invalid" });
    }

    const requiredHeaders = ["name", "role", "company", "industry", "location", "linkedin_bio"];
    const first = rows[0];
    const missing = requiredHeaders.filter((h) => !(h in first));
    if (missing.length > 0) {
      await fs.unlink(filePath).catch(() => {});
      return res.status(400).json({ message: `CSV missing required headers: ${missing.join(", ")}` });
    }

    const { inserted } = await saveLeadsToDB(rows);

    // delete uploaded file (cleanup)
    await fs.unlink(filePath).catch(() => {});

    console.log(`>> [API]: /api/v1/leads/upload | [STATUS]: Uploaded ${rows.length} rows`);
    return res.status(200).json({ message: `Uploaded ${rows.length} rows`, inserted });
  } catch (err) {
    // cleanup
    await fs.unlink(filePath).catch(() => {});
    console.error("uploadLeads error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: String(err) });
  }
};
