// Routes responsible for provisioning tables and listing table metadata
import { Router } from "express";
import { createTableAndRegister } from "../services/registry.js";

export function provisionRoutes(knex) {
  const r = Router();

  r.post("/provision/table", async (req, res, next) => {
    try {
      const result = await createTableAndRegister(knex, req.body);
      res.status(result.status).json(result.body);
    } catch (e) {
      next(e);
    }
  });

  r.get("/provision/tables", async (req, res, next) => {
    try {
      const rows = await knex("table_registry")
        .select("table_name", "definition", "created_at", "updated_at")
        .orderBy("table_name", "asc");
      res.json(
        rows.map((r) => ({
          tableName: r.table_name,
          definition: safeParse(r.definition),
          created_at: r.created_at,
          updated_at: r.updated_at,
        }))
      );
    } catch (e) {
      next(e);
    }
  });

  r.delete("/provision/table/:tableName", async (req, res, next) => {
    try {
      const { tableName } = req.params;

      // Check if table exists in registry
      const registryEntry = await knex("table_registry")
        .where({ table_name: tableName })
        .first();

      if (!registryEntry) {
        return res.status(404).json({ message: "table not found" });
      }

      // Drop the physical table
      try {
        await knex.schema.dropTable(tableName);
      } catch (dropError) {
        // Log but don't fail - table might not exist physically
        console.warn(`Failed to drop table ${tableName}:`, dropError.message);
      }

      // Remove from registry
      await knex("table_registry").where({ table_name: tableName }).del();

      res.json({ message: "table deleted successfully", tableName });
    } catch (e) {
      next(e);
    }
  });

  return r;
}

function safeParse(v) {
  if (v === undefined || v === null) return {};
  if (typeof v === "object") return v;
  try {
    return JSON.parse(v);
  } catch (e) {
    console.warn("failed to parse definition JSON", e, v);
    return {};
  }
}
