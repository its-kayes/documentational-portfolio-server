import mongoose from "mongoose";
import app from "./app";
import { MONGO_URI, PORT } from "./config/siteEnv";
import AppError from "./utils/appError";

const port: number = PORT || 3000;

main().catch((err) => console.log(err));

async function main() {
  try {
    await mongoose.connect(MONGO_URI);
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    new AppError(error as string, 502);
  }
}
