import prisma from "../utils/prismaClient";
import { Lead } from "../interfaces/lead.table";


/**
 * Retrieves all lead records from the database, sorted by creation date in descending order.
 * * This utility function is designed for comprehensive data retrieval and provides
 * a centralized, type-safe method for fetching the entire lead dataset for display
 * or further processing.
 * * It uses Prisma's `findMany` for efficient bulk fetching and ensures consistent
 * ordering based on the `createdAt` timestamp.
 * * Note: The check `if (!leads)` is a defensive guard against unexpected null return
 * types, although Prisma's `findMany` is guaranteed to return an empty array (`[]`)
 * if no records are found, making the second `return leads` the primary path.
 *
 * @returns {Promise<Lead[]>} A promise that resolves to an array of Lead objects.
 * Returns an empty array (`[]`) on database errors or if no leads are found.
 * @async
 */
export async function getLeads(): Promise<Lead[]> {
  try {
    // Fetch all records, prioritizing the newest leads.
    const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" }});
    
    // Defensive check against potential unexpected nulls from the ORM.
    if (!leads) return [];
    
    return leads;
  } catch (error) {
    // Log the error for debugging purposes and fail gracefully by returning an empty array.
    console.log(`Error: ${error}`);
    return []
  } 
}


/**
 * Executes a high-performance bulk insertion of lead records into the database 
 * using Prisma's `createMany` command.
 * * This function is optimized for processing batched, normalized data, typically 
 * originating from a file ingestion process (e.g., CSV parsing). It ensures data 
 * consistency by performing essential string normalization (trimming) before 
 * interacting with the persistence layer.
 * * @param {Record<string, string>[]} rows - An array of objects representing lead data. 
 * The keys of these records must align with the expected column headers from the source 
 * (e.g., CSV file), including: 'name', 'role', 'company', 'industry', 'location', 
 * and 'linkedin_bio' (or 'linkedinBio' as an acceptable alias).
 * @returns {Promise<{ inserted: number }>} A Promise that resolves to an object 
 * containing the count of successfully inserted records (`inserted`). Returns 
 * `{ inserted: 0 }` immediately if the input array is empty or invalid.
 * @async
 */
export async function saveLeadsToDB(rows: Record<string, string>[]): Promise<{ inserted: number; }> {
  if (!rows || rows.length === 0) return { inserted: 0 };

  // Normalize rows to match prisma types and ensure data cleanliness.
  // Trimming is essential to prevent unintended leading/trailing whitespace 
  // from causing data integrity issues or failed unique constraints.
  const data = rows.map((r) => ({
    name: (r.name || "").trim(),
    role: (r.role || "").trim(),
    company: (r.company || "").trim(),
    industry: (r.industry || "").trim(),
    location: (r.location || "").trim(),
    // Handle key variation for the LinkedIn biography field
    linkedin_bio: (r.linkedin_bio || r.linkedinBio || "").trim(),
  }));

  // Use createMany for bulk insert, significantly reducing database round trips 
  // and improving transactional throughput compared to individual 'create' calls.
  const result = await prisma.lead.createMany({
    data,
    // Prevents the entire operation from failing if a single record violates 
    // a unique constraint (e.g., unique email or combined key).
    skipDuplicates: true,
  });

  return { inserted: result.count ?? 0 };
};
