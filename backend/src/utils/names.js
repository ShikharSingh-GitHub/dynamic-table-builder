export const NAME_RE = /^[a-z][a-z0-9_]{0,29}$/;
const RESERVED = new Set([
  "id",
  "created_at",
  "updated_at",
  "__proto__",
  "constructor",
]);

export function validateEntityName(name) {
  if (!NAME_RE.test(name)) return "must match ^[a-z][a-z0-9_]{0,29}$";
  if (RESERVED.has(name)) return "is reserved";
  return null;
}
