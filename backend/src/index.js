import cors from "cors";
import express from "express";
import { config } from "./config.js";
import { knex } from "./db.js";
import { errorHandler } from "./middleware/errors.js";
import { dynamicRoutes } from "./routes/dynamic.js";
import { provisionRoutes } from "./routes/provision.js";
import { ensureRegistry } from "./services/registry.js";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

await ensureRegistry(knex);

app.use(provisionRoutes(knex));
app.use(dynamicRoutes(knex));

app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Backend up at http://localhost:${config.port}`);
});
