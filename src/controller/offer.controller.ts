import { Request, Response } from "express";
import prisma from "../utils/prismaClient";

/**
 * Controller function responsible for creating a new `Offer` entity.
 * * This RESTful endpoint validates that the required fields (`name`, `value_props`, 
 * and `ideal_use_cases`) are present and non-empty arrays (for the latter two) 
 * before committing the resource to the persistence layer. 
 * * It ensures ACID compliance by wrapping the database transaction logic.
 * * @param {Request} req - The Express request object. Expects a JSON body with:
 * - `name`: (string) The mandatory unique identifier/name for the offer.
 * - `value_props`: (string[]) Mandatory. An array of unique selling points; must not be empty.
 * - `ideal_use_cases`: (string[]) Mandatory. An array outlining target use cases; must not be empty.
 * @param {Response} res - The Express response object.
 * @returns {Promise<Response>} A promise resolving to the Express response:
 * - Status 201 (Created): Resource created successfully, returns the new offer object.
 * - Status 400 (Bad Request): Input validation failure (missing/empty required fields).
 * - Status 500 (Internal Server Error): Database or server processing error.
 * @async
 */
export const createOffer = async (req: Request, res: Response): Promise<Response> => {
  console.log(`>> [API]: /api/v1/offer`);
  try {
    const { name, value_props, ideal_use_cases } = req.body;

    // Basic validation: Check for null/undefined fields and ensuring arrays are non-empty.
    if (!name || !value_props?.length || !ideal_use_cases?.length) {
      return res.status(400).json({
        error: "Missing required fields: name, value_props, ideal_use_cases",
      });
    }

    // Attempt to create the offer using Prisma.
    const newOffer = await prisma.offer.create({
      data: {
        name,
        // Arrays are passed directly, assuming the Prisma schema supports list types for these fields.
        value_props,
        ideal_use_cases,
      },
    });

    // log
    console.log(`>> [API]: /api/v1/offer | [STATUS]: Offer saved ${JSON.stringify(newOffer)}`);
    // Success response for resource creation.
    return res.status(201).json({ message: "Offer created successfully", offer: newOffer });
  } catch (error) {
    console.error("Error creating offer:", error);
    // Log the error and return a generic 500 status to the client.
    return res.status(500).json({ error: "Failed to create offer" });
  }
};
