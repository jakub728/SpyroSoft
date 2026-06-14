import { Router } from "express";
import { type Request, type Response, type NextFunction } from "express";
import {
  type ApiElement,
  type IObject,
  type GenerationMixItem,
} from "../types/all";

const router = Router();

//http://localhost:5000/api/first
router.get(
  "/first",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateNow = new Date();
      dateNow.setHours(0, 0, 0, 0);
      const tzOffsetMs = dateNow.getTimezoneOffset() * 75000;
      const startTime = dateNow.getTime() - tzOffsetMs;
      const add1day = 86400000;
      const endTime = startTime + add1day * 3;

      const start = new Date(startTime).toISOString();
      const end = new Date(endTime).toISOString();

      const url = `https://api.carbonintensity.org.uk/generation/${start}/${end}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = new Error(
          `Request failed with status ${response.status}`,
        ) as any;
        error.status = response.status;
        return next(error);
      }

      const result = await response.json();
      const flatData = result.data;

      const date = new Date(startTime).toISOString().slice(0, 10);
      const dateNext = new Date(startTime + add1day).toISOString().slice(0, 10);
      const dateNextNext = new Date(startTime + 2 * add1day)
        .toISOString()
        .slice(0, 10);

      function countFuel(array: ApiElement[], date: string) {
        const data = array.filter(
          (e) => e.from.includes(date) && e.to.includes(date),
        );

        const fuelSums = data.reduce(
          (acc, item) => {
            item.generationmix.forEach((element) => {
              const fuelName = element.fuel;
              const percent = element.perc;

              if (!acc[fuelName]) {
                acc[fuelName] = 0;
              }

              acc[fuelName] += percent;
            });

            return acc;
          },
          {} as Record<string, any>,
        );

        Object.keys(fuelSums).forEach((element) => {
          fuelSums[element] = fuelSums[element] / data.length;
          fuelSums[element] = Number(fuelSums[element].toFixed(2));
        });

        fuelSums.data = date;
        fuelSums.cleanEnergy =
          fuelSums.biomass +
          fuelSums.nuclear +
          fuelSums.hydro +
          fuelSums.wind +
          fuelSums.solar;
        return fuelSums;
      }

      const final = [];
      final.push(countFuel(flatData, date));
      final.push(countFuel(flatData, dateNext));
      final.push(countFuel(flatData, dateNextNext));

      return res.status(200).json(flatData);
    } catch (error: any) {
      console.error(error);
      next(error);
    }
  },
);

//http://localhost:5000/api/second/:hour
router.get(
  "/second/:hour",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateNow = new Date();
      dateNow.setHours(0, 0, 0, 0);
      const tzOffsetMs = dateNow.getTimezoneOffset() * 75000;
      const startTime = dateNow.getTime() - tzOffsetMs;
      const add1day = 86400000;
      const endTime = startTime + add1day * 3;

      const start = new Date(startTime).toISOString();
      const end = new Date(endTime).toISOString();

      const url = `https://api.carbonintensity.org.uk/generation/${start}/${end}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        const error = new Error(
          `Request failed with status ${response.status}`,
        ) as any;
        error.status = response.status;
        return next(error);
      }

      const result = await response.json();
      const flatData = result.data;

      const filteredData: IObject[] = flatData.map((element: ApiElement) => {
        const newObj: IObject = {
          from: element.from,
          to: element.to,
          cleanFuel:
            (element.generationmix.find(
              (el: GenerationMixItem) => el.fuel === "biomass",
            )?.perc || 0) +
            (element.generationmix.find(
              (el: GenerationMixItem) => el.fuel === "wind",
            )?.perc || 0) +
            (element.generationmix.find(
              (el: GenerationMixItem) => el.fuel === "nuclear",
            )?.perc || 0) +
            (element.generationmix.find(
              (el: GenerationMixItem) => el.fuel === "hydro",
            )?.perc || 0) +
            (element.generationmix.find(
              (el: GenerationMixItem) => el.fuel === "solar",
            )?.perc || 0),
        };

        return newObj;
      });

      const uniqueData = filteredData.filter(
        (item, index, self) =>
          self.findIndex((t) => t.from === item.from) === index,
      );

      const number = req.params.hour as unknown as number;
      const numberElements = number * 2;
      let maxAverge = 0;
      let best = null;

      for (let i = 0; i < uniqueData.length; i++) {
        const windowSegment = uniqueData.slice(i, i + numberElements);
        if (windowSegment.length !== numberElements) {
          continue;
        }

        const sum = windowSegment.reduce(
          (acc, item) => acc + item.cleanFuel,
          0,
        );

        const currentAverge = sum / numberElements;
        if (currentAverge > maxAverge) {
          maxAverge = currentAverge;
          best = windowSegment;
        }
      }

      if (!best || best.length === 0) {
        const error = new Error("Couldn't find time window") as any;
        error.status = 404;
        return next(error);
      }

      const startBest = best[0].from;
      const endBest = best[numberElements - 1].to;

      return res.status(200).json({ averge: maxAverge, startBest, endBest });
    } catch (error: any) {
      console.error(error);
      next(error);
    }
  },
);

export default router;
