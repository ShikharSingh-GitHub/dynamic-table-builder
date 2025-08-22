export function buildListQuery({
  knex,
  tableName,
  meta,
  q,
  page,
  pageSize,
  sort,
  order,
}) {
  const qb = knex(tableName);
  const textCols = meta.columns
    .filter((c) => ["string", "text"].includes(c.type))
    .map((c) => c.name);
  if (q && textCols.length) {
    qb.where(function () {
      for (const col of textCols) this.orWhere(col, "like", `%${q}%`);
    });
  }
  const validCols = new Set(
    meta.columns.map((c) => c.name).concat(["id", "created_at", "updated_at"])
  );
  const sortCol = validCols.has(sort) ? sort : "id";
  const dir = order === "desc" ? "desc" : "asc";
  qb.orderBy(sortCol, dir);
  const limit = Math.min(Math.max(pageSize || 20, 1), 100);
  const offset = Math.max(((page || 1) - 1) * limit, 0);
  return { qb, limit, offset };
}
