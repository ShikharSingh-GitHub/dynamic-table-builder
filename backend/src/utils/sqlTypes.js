export function toMySqlType(col) {
  switch (col.type) {
    case "string":
      return "VARCHAR(255)";
    case "text":
      return "TEXT";
    case "integer":
      return "INT";
    case "decimal":
      return "DECIMAL(18,4)";
    case "boolean":
      return "TINYINT(1)";
    case "date":
      return "DATE";
    case "datetime":
      return "DATETIME";
    default:
      throw new Error(`Unsupported type: ${col.type}`);
  }
}

export const ALLOWED_TYPES = new Set([
  "string",
  "text",
  "integer",
  "decimal",
  "boolean",
  "date",
  "datetime",
]);
