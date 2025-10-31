import express, { Request, Response } from "express";
import cors from "cors";
import leadRoutes from "./routes/lead.router";
import scoreRoutes from "./routes/score.router";
import resultsRoutes from "./routes/results.router";
import offerRoutes from "./routes/offer.router";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

/**  NOTE: --- API route for uploading leads (CSV) ---
  curl -X POST "http://localhost:8000/api/v1/leads/upload" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@/path/to/leads.csv"
 */
app.use("/api/v1/leads", leadRoutes);

/**
 * NOTE: --- API route to create offer ---
  curl -X POST http://localhost:8000/api/v1/offer \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Predictive Lead Scoring",
    "value_props": ["Prioritize hot leads", "Boost sales productivity by 40%"],
    "ideal_use_cases": ["B2B SaaS sales teams", "Outbound prospecting automation"]
  }'
 */
app.use("/api/v1/offer", offerRoutes);

/**
 * NOTE: --- API route to calculate rule based AI based scoring ---
 * 📌 Please note that this API takes good amount of time to calculate the score for all leads, because of the LLM call & processing all leads.
 * 📌 Average time to get back the result/score on a small csv is about a "Minute" which is a lot, in future this can be optimized.
 * */
app.use("/api/v1/score", scoreRoutes);

/**
 * NOTE: --- API routes for filtering & exporting results/leads ---
 * 📌 curl -X GET localhost:8000/api/v1/results                             Get all the leads from the db
 * 📌 curl -X GET localhost:8000/api/v1/results?intent=Hight                Get all the leads with High intent {intent value is not case sensitive}
 * 📌 curl -X GET localhost:8000/api/v1/results?intent=medium&min_score=40  Get all the leads with Medium intent and filter by the score
 * 📌 curl -X GET localhost:8000/api/v1/results/export -o scored_leads.csv  Export results to a CSV file
 * */
app.use("/api/v1/results", resultsRoutes);

// Health check api
app.get("/", (_req: Request, res: Response) => {
  console.log(`>> [API]: / | [STATUS]: Success`);
  return res.status(200).json({ success: true, message: "Health check done!" });
});

export default app;
