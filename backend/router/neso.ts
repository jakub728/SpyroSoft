import { Router } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { type Input, type IObject } from "../types/all";

const router = Router();

router.get(
  "/first",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateNow = new Date();
      dateNow.setHours(2, 30, 0, 0);

      let timeNow = dateNow.getTime();
      const add30 = 1800000;

      const fetchPromises = [];

      for (let i = 0; i < 144; i++) {
        let date = new Date(timeNow).toISOString();
        let date30 = new Date(timeNow + add30).toISOString();

        const url = `https://api.carbonintensity.org.uk/generation/${date}/${date30}`;

        fetchPromises.push(
          fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        );

        timeNow += add30;
      }

      const httpResponses = await Promise.all(fetchPromises);
      const fetchData = [];

      for (const httpResponse of httpResponses) {
        if (!httpResponse.ok) {
          const error = new Error(
            `Request failed with status ${httpResponse.status}`,
          ) as any;
          error.status = httpResponse.status;
          return next(error);
        }

        const jsonResult = await httpResponse.json();
        fetchData.push(jsonResult.data);
      }

      const flatData = fetchData.flat();

      //
      const timeNow2 = dateNow.getTime();
      const add1day = 86400000;
      const date = new Date(timeNow2).toISOString().slice(0, 10);
      const dateNext = new Date(timeNow2 + add1day).toISOString().slice(0, 10);
      const dateNextNext = new Date(timeNow2 + 2 * add1day)
        .toISOString()
        .slice(0, 10);
      //

      function countFuel(array: Input[], date: string) {
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

      const response = [];
      response.push(countFuel(flatData, date));
      response.push(countFuel(flatData, dateNext));
      response.push(countFuel(flatData, dateNextNext));

      return res.status(200).json(response);
    } catch (error: any) {
      console.error(error);
      next(error);
    }
  },
);

router.get(
  "/second/:hour",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateNow = new Date();
      dateNow.setHours(2, 30, 0, 0);

      let timeNow = dateNow.getTime();
      const add30 = 1800000;

      const fetchPromises = [];

      for (let i = 0; i < 96; i++) {
        let date = new Date(timeNow).toISOString();
        let date30 = new Date(timeNow + add30).toISOString();

        const url = `https://api.carbonintensity.org.uk/generation/${date}/${date30}`;

        fetchPromises.push(
          fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }),
        );

        timeNow += add30;
      }

      const httpResponses = await Promise.all(fetchPromises);
      const fetchData = [];

      for (const httpResponse of httpResponses) {
        if (!httpResponse.ok) {
          const error = new Error(
            `Request failed with status ${httpResponse.status}`,
          ) as any;
          error.status = httpResponse.status;
          return next(error);
        }

        const jsonResult = await httpResponse.json();
        fetchData.push(jsonResult.data);
      }

      const flatData = fetchData.flat();

      const filteredData = flatData.map((element) => {
        const newObj: IObject = {
          from: element.from,
          to: element.to,
          cleanFuel:
            element.generationmix.find(
              (element: any) => element.fuel === "biomass",
            )?.perc +
            element.generationmix.find(
              (element: any) => element.fuel === "wind",
            )?.perc +
            element.generationmix.find(
              (element: any) => element.fuel === "nuclear",
            )?.perc +
            element.generationmix.find(
              (element: any) => element.fuel === "hydro",
            )?.perc +
            element.generationmix.find(
              (element: any) => element.fuel === "solar",
            )?.perc,
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

      const start = best[0].from;
      const end = best[numberElements - 1].to;

      return res.status(200).json({ averge: maxAverge, start, end });
    } catch (error: any) {
      console.error(error);
      next(error);
    }
  },
);

export default router;
