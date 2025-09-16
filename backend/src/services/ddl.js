import { toMySqlType } from "../utils/sqlTypes.js";

// Build CREATE TABLE SQL statements based on user provided column definitions
export function buildCreateTableSQL(tableName, columns) {
  const parts = [];
  parts.push("`id` BIGINT PRIMARY KEY AUTO_INCREMENT");

  for (const c of columns) {
    const type = toMySqlType(c);
    const nullable = c.nullable ? "NULL" : "NOT NULL";
    const defPart =
      c.default === undefined || c.default === null
        ? ""
        : ` DEFAULT ${literalDefault(c)}`;
    parts.push("`" + c.name + "` " + type + " " + nullable + defPart);
  }

  parts.push("`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP");
  parts.push(
    "`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  );

  return `CREATE TABLE \`${tableName}\` (\n  ${parts.join(
    ",\n  "
  )}\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;
}

function literalDefault(c) {
  switch (c.type) {
    case "integer":
    case "decimal":
    case "boolean":
      return String(c.default);
    case "date":
    case "datetime":
      if (c.default === "CURRENT_TIMESTAMP") return "CURRENT_TIMESTAMP";
      return `'${c.default}'`;
    default:
      return `'${String(c.default).replace(/'/g, "''")}'`;
  }
}
