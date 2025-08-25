import knexFn from "knex";
import { config } from "./config.js";

// Initialize and export the Knex DB client configured with env settings
export const knex = knexFn({
  client: "mysql2",
  connection: config.db,
  pool: { min: 1, max: 10 },
  wrapIdentifier: (v, orig) => orig(v.replace(/[^a-z0-9_]/g, "")),
});
