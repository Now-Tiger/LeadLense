import { Request, Response } from "express";
import { Parser } from "json2csv";
import prisma from "../utils/prismaClient";
import { getLeads } from "../services/lead.service";

/**
 * Controller function to fetch a filtered and paginated list of leads.
 * * It supports querying by lead intent and filtering by a minimum score threshold.
 * * The function utilizes Prisma's `findMany` for efficient data retrieval and applies
 * dynamic WHERE clauses based on the presence of query parameters.
 * * @param {Request} req - The Express request object, expecting query parameters:
 * - `intent`: (string) Optional. Filters leads by a specific intent value.
 * - `min_score`: (string | number) Optional. Filters leads where the score is
 * greater than or equal to this value (GTE). Must be convertible to a number.
 * - `limit`: (string | number) Optional. Implements result pagination/limiting
 * using Prisma's `take`.
 * @param {Response} res - The Express response object used to send JSON data.
 * @returns {Promise<Response>} A promise that resolves to the Express response object.
 * - Status 200: Success response containing the lead count and the array of leads.
 * - Status 500: Error response if database retrieval fails.
 * @async
 */
export const getResults = async (req: Request, res: Response): Promise<Response> => {
  console.log(`>> [API]: /api/v1/results`)
  try {
    const { intent, min_score, limit } = req.query;

    // Build the dynamic Prisma filter object
    const where: any = {};

    // Handle intent filter (case-insensitive)
    if (intent) {
      const normalizedIntent = String(intent).trim().toLowerCase();
      const validIntents = ["high", "medium", "low"];

      if (validIntents.includes(normalizedIntent)) {
        // Capitalize first letter to match DB enum exactly ("High", "Medium", "Low")
        const formattedIntent =
          normalizedIntent.charAt(0).toUpperCase() + normalizedIntent.slice(1);
        where.intent = formattedIntent;
      }
    }

    // Handle min_score filter (numeric)
    if (min_score && !isNaN(Number(min_score))) {
      where.score = { gte: Number(min_score) };
    }

    // Fetch filtered leads
    const leads = await prisma.lead.findMany({
      where,
      take: limit ? Number(limit) : undefined,
      orderBy: { createdAt: "desc" },
    });

    console.log(`>> [API]: /api/v1/results | [STATUS]: ${leads.length} Leads fetched`);
    return res.status(200).json({
      message: "Results fetched successfully.",
      filters: where,
      count: leads.length,
      results: leads,
    });
  } catch (error: any) {
    console.error("Error fetching results:", error);
    return res.status(500).json({ error: "Failed to fetch results" });
  }
};

/**
 * Controller function to fetch all leads and export the entire dataset as a CSV file.
 * * This function performs a full table scan, serializes the resulting JSON objects
 * into a CSV string, and configures the HTTP response headers for a file download.
 * * @param {Request} _req - The Express request object (not used, hence prefixed with underscore).
 * @param {Response} res - The Express response object used for file stream delivery.
 * @returns {Promise<Response>} A promise that resolves to the Express response object.
 * - Status 200: Success, sends the CSV file content.
 * - Status 404: Not Found response if no leads are present in the database.
 * - Status 500: Error response if database retrieval or CSV parsing fails.
 * @async
 */
export const exportResults = async (_req: Request, res: Response): Promise<Response> => {
  console.log(`>> [API]: /api/v1/results/export`)
  try {
    // Fetch all leads without filtering or limiting.
    const leads = await getLeads();

    if (leads.length === 0) {
      // Graceful exit if the database is empty.
      return res.status(404).json({ message: "No leads found to export" });
    }

    // Initialize the CSV parser utility.
    const json2csv = new Parser();
    // Perform synchronous conversion of the JSON array to a CSV string.
    const csv = json2csv.parse(leads);

    // Set the necessary HTTP headers for a file download.
    // 1. Content-Type: Designates the content as a comma-separated values file.
    res.header("Content-Type", "text/csv");
    // 2. Content-Disposition: Instructs the browser to download the file
    //    and suggests the default filename.
    res.attachment("scored_leads.csv");

    // Send the generated CSV string back to the client.
    console.log(`>> [API]: /api/v1/results/export | [STATUS]: Success`);
    return res.send(csv);
  } catch (error: any) {
    console.error("Error exporting results:", error);
    // Explicitly handle errors during database retrieval or CSV serialization.
    return res.status(500).json({ error: "Failed to export results" });
  }
};
