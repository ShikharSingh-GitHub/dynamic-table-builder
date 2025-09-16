import { validateEntityName } from "../utils/names.js";
import { ALLOWED_TYPES } from "../utils/sqlTypes.js";
import { buildCreateTableSQL } from "./ddl.js";

// Service that manages the metadata registry (table_registry) and provisions tables
export async function ensureRegistry(knex) {
  const exists = await knex.schema.hasTable("table_registry");
  if (!exists) {
    await knex.schema.createTable("table_registry", (t) => {
      t.increments("id").primary();
      t.string("table_name", 64).notNullable().unique();
      t.json("definition").notNullable(); // { columns: [...] }
      t.timestamp("created_at").defaultTo(knex.fn.now());
      t.timestamp("updated_at").defaultTo(knex.fn.now());
    });
  }
}

export function validateColumns(columns) {
  if (!Array.isArray(columns) || columns.length < 1 || columns.length > 10) {
    return { columns: "1–10 columns required" };
  }
  const errs = {};
  const seen = new Set();
  for (const c of columns) {
    const e = validateEntityName(c.name);
    if (e) errs[c.name || "name"] = e;
    if (!ALLOWED_TYPES.has(c.type)) errs[c.name] = "invalid type";
    if (seen.has(c.name)) errs[c.name] = "duplicate";
    seen.add(c.name);
  }
  return Object.keys(errs).length ? errs : null;
}

export async function createTableAndRegister(knex, payload) {
  const { tableName, columns } = payload;

  const nameErr = validateEntityName(tableName);
  if (nameErr) return { status: 400, body: { errors: { tableName: nameErr } } };

  const exists = await knex("table_registry")
    .where({ table_name: tableName })
    .first();
  if (exists)
    return { status: 400, body: { errors: { tableName: "already exists" } } };

  const colErrs = validateColumns(columns);
  if (colErrs) return { status: 400, body: { errors: colErrs } };

  const sql = buildCreateTableSQL(tableName, columns);
  await knex.raw(sql);

  await knex("table_registry").insert({
    table_name: tableName,
    definition: JSON.stringify({ columns }),
    created_at: knex.fn.now(),
    updated_at: knex.fn.now(),
  });

  return { status: 200, body: { tableName, columns } };
}

export async function getTableMeta(knex, tableName) {
  try {
    const row = await knex("table_registry")
      .where({ table_name: tableName })
      .first();
    if (!row) {
      console.log(`Table meta not found for: ${tableName}`);
      return null;
    }

    let definition;
    // Handle both string and object cases for the definition field
    if (typeof row.definition === "string") {
      try {
        definition = JSON.parse(row.definition);
      } catch (parseError) {
        console.error(
          `Error parsing definition for table ${tableName}:`,
          parseError
        );
        return null;
      }
    } else if (typeof row.definition === "object" && row.definition !== null) {
      definition = row.definition;
    } else {
      console.error(
        `Invalid definition type for table ${tableName}:`,
        typeof row.definition
      );
      return null;
    }

    return {
      tableName: row.table_name,
      columns: definition.columns || [],
    };
  } catch (error) {
    console.error(`Error getting table meta for ${tableName}:`, error);
    return null;
  }
}
