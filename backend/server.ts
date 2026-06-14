import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ZodError } from "zod";
import dataRouter from "./router/neso";

const app = express();
const PORT = process.env.PORT || 5000;

//! MIDDLEWARE
dotenv.config();
app.use(cors());
app.use(express.json());

app.use("/api", dataRouter);

//! GLOBAL ERROR HANDLER
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.issues,
    });
  }
  res
    .status(err.status || 500)
    .json({ message: err.message || "Internal Server Error" });
});

//! START THE SERVER
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
