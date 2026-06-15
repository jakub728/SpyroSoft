/// <reference types="jest" />
import express from "express";
import request from "supertest";
import router from "./neso";

const app = express();
app.use(express.json());
app.use("/api", router);

const mockCarbonIntensityData = {
  data: [
    {
      from: "2026-06-15T00:00:00.000Z",
      to: "2026-06-15T00:30:00.000Z",
      generationmix: [
        { fuel: "biomass", perc: 10 },
        { fuel: "nuclear", perc: 20 },
        { fuel: "hydro", perc: 5 },
        { fuel: "wind", perc: 15 },
        { fuel: "solar", perc: 10 },
        { fuel: "gas", perc: 30 },
        { fuel: "coal", perc: 10 },
      ],
    },
    {
      from: "2026-06-15T00:30:00.000Z",
      to: "2026-06-15T01:00:00.000Z",
      generationmix: [
        { fuel: "biomass", perc: 10 },
        { fuel: "nuclear", perc: 20 },
        { fuel: "hydro", perc: 5 },
        { fuel: "wind", perc: 25 },
        { fuel: "solar", perc: 10 },
        { fuel: "gas", perc: 20 },
        { fuel: "coal", perc: 10 },
      ],
    },
  ],
};

describe("Tests Carbon Intensity", () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  describe("GET /api/first", () => {
    it("should return status 200 and Array with 3 days data", async () => {
      (jest.spyOn(global, "fetch") as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCarbonIntensityData,
      });

      const res = await request(app).get("/api/first");

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);

      const firstDay = res.body[0];
      expect(firstDay).toHaveProperty("data");
      expect(firstDay).toHaveProperty("cleanEnergy");
      expect(typeof firstDay.cleanEnergy).toBe("number");
    });

    it("if error give HTTP error code from external API", async () => {
      (jest.spyOn(global, "fetch") as any).mockResolvedValue({
        ok: false,
        status: 502,
        json: async () => ({}),
      });

      const res = await request(app).get("/api/first");
      expect(res.status).toBe(502);
    });
  });

  describe("GET /api/second/:hour", () => {
    it("return status 200 an widow for gien ammount of hours", async () => {
      (jest.spyOn(global, "fetch") as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCarbonIntensityData,
      });

      const res = await request(app).get("/api/second/1");

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("averge");
      expect(res.body).toHaveProperty("startBest");
      expect(res.body).toHaveProperty("endBest");
      expect(res.body.startBest).toBe("2026-06-15T00:00:00.000Z");
      expect(res.body.endBest).toBe("2026-06-15T01:00:00.000Z");
    });

    it("should return status 404 when the requested time window exceeds the available API data", async () => {
      (jest.spyOn(global, "fetch") as any).mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => mockCarbonIntensityData,
      });

      const res = await request(app).get("/api/second/10");
      expect(res.status).toBe(404);
    });
  });
});
