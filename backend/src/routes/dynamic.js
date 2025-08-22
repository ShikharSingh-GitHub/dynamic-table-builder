import { Router } from "express";
import { getTableMeta } from "../services/registry.js";
import { buildListQuery } from "../utils/queries.js";

export function dynamicRoutes(knex) {
  const r = Router();

  r.get("/api/:table", async (req, res, next) => {
    try {
      const table = req.params.table;
      const meta = await getTableMeta(knex, table);
      if (!meta) return res.status(404).json({ message: "table not found" });

      const { q, page, pageSize, sort, order } = req.query;
      const { qb, limit, offset } = buildListQuery({
        knex,
        tableName: table,
        meta,
        q,
        page: Number(page),
        pageSize: Number(pageSize),
        sort,
        order,
      });
      const [rows, [{ total }]] = await Promise.all([
        qb.clone().limit(limit).offset(offset),
        knex(table).count("id as total"),
      ]);
      res.json({
        data: rows,
        page: Number(page) || 1,
        pageSize: limit,
        total: Number(total),
        totalPages: Math.ceil(Number(total) / limit),
        sort: {
          column: sort || "id",
          order: order === "desc" ? "desc" : "asc",
        },
      });
    } catch (e) {
      next(e);
    }
  });

  r.get("/api/:table/:id", async (req, res, next) => {
    try {
      const { table, id } = req.params;
      const meta = await getTableMeta(knex, table);
      if (!meta) return res.status(404).json({ message: "table not found" });

      const row = await knex(table).where({ id }).first();
      if (!row) return res.status(404).json({ message: "row not found" });

      res.json(row);
    } catch (e) {
      next(e);
    }
  });

  r.post("/api/:table", async (req, res, next) => {
    try {
      const table = req.params.table;
      const meta = await getTableMeta(knex, table);
      if (!meta) return res.status(404).json({ message: "table not found" });

      const payload = req.body;
      const missing = requiredMissing(meta, payload);
      if (missing.length)
        return res.status(400).json({
          message: "missing required fields",
          fields: missing,
        });

      const filtered = filterAllowed(meta, payload);
      const [id] = await knex(table).insert(filtered);
      const row = await knex(table).where({ id }).first();
      res.status(201).json(row);
    } catch (e) {
      next(e);
    }
  });

  r.put("/api/:table/:id", async (req, res, next) => {
    try {
      const { table, id } = req.params;
      const meta = await getTableMeta(knex, table);
      if (!meta) return res.status(404).json({ message: "table not found" });

      const payload = req.body;
      const filtered = filterAllowed(meta, payload);
      await knex(table).where({ id }).update(filtered);
      const row = await knex(table).where({ id }).first();
      res.json(row);
    } catch (e) {
      next(e);
    }
  });

  r.delete("/api/:table/:id", async (req, res, next) => {
    try {
      const { table, id } = req.params;
      const meta = await getTableMeta(knex, table);
      if (!meta) return res.status(404).json({ message: "table not found" });

      await knex(table).where({ id }).delete();
      res.status(204).send();
    } catch (e) {
      next(e);
    }
  });

  return r;
}

function filterAllowed(meta, body) {
  const allowed = new Set(meta.columns.map((c) => c.name));
  const out = {};
  for (const k of Object.keys(body || {})) {
    if (allowed.has(k)) out[k] = body[k];
  }
  return out;
}
function requiredMissing(meta, payload) {
  const miss = [];
  for (const c of meta.columns) {
    if (
      c.nullable === false &&
      (payload[c.name] === undefined || payload[c.name] === null)
    ) {
      miss.push(c.name);
    }
  }
  return miss;
}
