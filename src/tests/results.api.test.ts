import request from "supertest";
import app from "../index"; // your Express app
import prisma from "../utils/prismaClient";

describe("GET /api/v1/results", () => {
  beforeAll(async () => {
    // Ensure the DB has at least one entry to test with
    await prisma.lead.create({
      data: {
        name: "Test Lead",
        role: "Growth Manager",
        company: "TestCorp",
        industry: "B2B SaaS",
        location: "London",
        linkedin_bio: "Leading B2B SaaS scaling strategies.",
        intent: "High",
        reasoning: "For testing only.",
        score: 80,
      },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should fetch all results successfully", async () => {
    const res = await request(app).get("/api/v1/results");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Results fetched successfully.");
    expect(res.body).toHaveProperty("filters");
    expect(Array.isArray(res.body.results)).toBe(true);
    expect(res.body.results.length).toBeGreaterThan(0);
  });

  it("should fetch filtered results by intent (case-insensitive)", async () => {
    const res = await request(app).get("/api/v1/results?intent=high");

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message", "Results fetched successfully.");
    expect(res.body.filters).toHaveProperty("intent", "High");
    expect(Array.isArray(res.body.results)).toBe(true);

    // All results must have intent = "High"
    res.body.results.forEach((lead: any) => {
      expect(lead.intent).toBe("High");
    });
  });

  it("should return limited results when limit is applied", async () => {
    const res = await request(app).get("/api/v1/results?limit=2");

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBeLessThanOrEqual(2);
  });
});
