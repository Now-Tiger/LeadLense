import fs from "fs";
import csv from "csv-parser";

/**
 * Asynchronously parses a CSV file from the specified path, utilizing Node.js streaming 
 * for efficient, memory-friendly processing of large datasets without blocking the event loop.
 * * This implementation wraps the stream operations in a Promise, providing a clean, async/await 
 * compatible interface for handling the completion or failure of the file I/O and parsing process.
 * * @param {string} filePath - The absolute or relative path to the target CSV file.
 * @returns {Promise<Record<string, string>[]>} A Promise that resolves with an array of records. 
 * Each element represents a row in the CSV, structured as a key-value object where 
 * keys correspond to column headers (strings) and values are the cell contents (strings).
 * @throws {Error} Rejects the Promise with an Error object if the file cannot be read (e.g., file not found, permission denied) 
 * or if the CSV parser encounters a critical streaming error.
 */
export const parseCSV = (filePath: string): Promise<Record<string, string>[]> => {
  return new Promise((resolve, reject) => {
    const results: Record<string, string>[] = [];
    
    // Initiate a readable stream for the file path. Streaming is crucial here for scalability, 
    // ensuring the entire file is not buffered into memory simultaneously.
    fs.createReadStream(filePath)
      // Pipe the raw stream into the CSV transformer stream (`csv()`), which handles chunking and parsing.
      .pipe(csv())
      // Attach a listener to collect data events (parsed rows).
      .on("data", (data) => results.push(data))
      // Resolve the Promise when the stream signals its end, indicating all data has been processed.
      .on("end", () => resolve(results))
      // Reject the Promise immediately upon any file system or parsing error in the pipeline.
      .on("error", (err) => reject(err));
  });
};
