import { toMySqlType } from "../utils/sqlTypes.js";

export function buildCreateTableSQL(tableName, columns) {
  const parts = [];
  parts.push("`id` BIGINT PRIMARY KEY AUTO_INCREMENT");

  for (const c of columns) {
    const type = toMySqlType(c);
    const nullable = c.nullable ? "NULL" : "NOT NULL";
    const defPart = getDefaultPart(c);
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

function getDefaultPart(c) {
  // If no default provided or empty string, don't add DEFAULT clause
  if (c.default === undefined || c.default === null || c.default === "") {
    return "";
  }

  return ` DEFAULT ${literalDefault(c)}`;
}

function literalDefault(c) {
  switch (c.type) {
    case "integer":
    case "decimal":
      return String(c.default);
    case "boolean":
      // Convert boolean to MySQL format (1 for true, 0 for false)
      if (c.default === true || c.default === "true") return "1";
      if (c.default === false || c.default === "false") return "0";
      return String(c.default); // For numeric values like 1, 0
    case "date":
    case "datetime":
      if (c.default === "CURRENT_TIMESTAMP") return "CURRENT_TIMESTAMP";
      return `'${c.default}'`;
    default:
      return `'${String(c.default).replace(/'/g, "''")}'`;
  }
}
