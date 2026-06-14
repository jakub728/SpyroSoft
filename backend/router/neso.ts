import { Router } from "express";
import { type Request, type Response, type NextFunction } from "express";
import { type Input } from "../types/all";

const router = Router();

router.get(
  "/get-data",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dateNow = new Date();
      dateNow.setHours(2, 30, 0, 0);

      let timeNow = dateNow.getTime();
      const add30 = 1800000;

      const fetchData = [];

      for (let i = 0; i < 144; i++) {
        let date: string = new Date(timeNow).toISOString();
        let date30: string = new Date(timeNow + add30).toISOString();
        const request = await fetch(
          `https://api.carbonintensity.org.uk/generation/${date}/${date30}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        const response = await request.json();
        fetchData.push(response.data);
        timeNow += add30;
      }

      const fullData = await Promise.all(fetchData);
      const flatData = fullData.flat();

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

      return res.json(response);
    } catch (error: any) {
      console.error(error);
      next(error);
    }
  },
);

export default router;
