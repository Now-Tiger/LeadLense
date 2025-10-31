import request from "supertest";
import app from "../index";
import prisma from "../utils/prismaClient";

describe("POST /api/v1/offer", () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("should create a new offer successfully", async () => {
    const res = await request(app)
      .post("/api/v1/offer")
      .send({
        name: "AI Outreach Automation",
        value_props: ["24/7 outreach", "6x more meetings"],
        ideal_use_cases: ["B2B SaaS mid-market"],
      });

    console.log("Response:", res.status, res.body); // ✅ debug log

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("message", "Offer created successfully");
    expect(res.body).toHaveProperty("offer");
  });
});
