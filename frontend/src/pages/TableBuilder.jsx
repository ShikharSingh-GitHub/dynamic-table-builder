import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";

const TYPES = [
  { value: "string", label: "String (255 chars)" },
  { value: "text", label: "Text (long)" },
  { value: "integer", label: "Integer" },
  { value: "decimal", label: "Decimal" },
  { value: "boolean", label: "Boolean" },
  { value: "date", label: "Date" },
  { value: "datetime", label: "Date & Time" },
];

export default function TableBuilder() {
  const nav = useNavigate();
  const [tableName, setTableName] = useState("");
  const [cols, setCols] = useState([
    { name: "name", type: "string", nullable: false, default: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const addCol = () => {
    if (cols.length < 10) {
      setCols([
        ...cols,
        { name: "", type: "string", nullable: true, default: "" },
      ]);
    }
  };

  const update = (i, k, v) =>
    setCols(cols.map((c, idx) => (idx === i ? { ...c, [k]: v } : c)));

  const remove = (i) => {
    if (cols.length > 1) {
      setCols(cols.filter((_, idx) => idx !== i));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate table name
    if (!tableName) {
      newErrors.tableName = "Table name is required";
    } else if (!/^[a-z][a-z0-9_]{0,29}$/.test(tableName)) {
      newErrors.tableName =
        "Table name must start with letter, contain only lowercase letters, numbers, underscores, max 30 chars";
    }

    // Validate columns
    const columnNames = new Set();
    cols.forEach((col, i) => {
      if (!col.name) {
        newErrors[`col_${i}_name`] = "Column name is required";
      } else if (!/^[a-z][a-z0-9_]{0,29}$/.test(col.name)) {
        newErrors[`col_${i}_name`] = "Invalid column name format";
      } else if (columnNames.has(col.name)) {
        newErrors[`col_${i}_name`] = "Duplicate column name";
      } else if (["id", "created_at", "updated_at"].includes(col.name)) {
        newErrors[`col_${i}_name`] = "Reserved column name";
      }
      columnNames.add(col.name);
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  async function submit(e) {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      const payload = {
        tableName,
        columns: cols.map((col) => ({
          ...col,
          default: col.default || undefined,
        })),
      };

      await api.post("/provision/table", payload);
      nav(`/admin/${tableName}`);
    } catch (error) {
      console.error("Error creating table:", error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || "Failed to create table",
        });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold">Create New Table</h1>

      {errors.general && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {errors.general}
        </div>
      )}

      <form onSubmit={submit} className="space-y-6">
        {/* Table Name */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Table Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.tableName ? "border-red-300" : "border-gray-300"
            }`}
            value={tableName}
            onChange={(e) => setTableName(e.target.value.toLowerCase())}
            placeholder="e.g., blog_posts, users, products"
            disabled={loading}
          />
          {errors.tableName && (
            <p className="text-sm text-red-600 mt-1">{errors.tableName}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Must start with a letter, lowercase letters/numbers/underscores
            only, max 30 chars
          </p>
        </div>

        {/* Columns */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">Columns ({cols.length}/10)</h3>
            <button
              type="button"
              onClick={addCol}
              disabled={cols.length >= 10 || loading}
              className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 add-column-btn">
              + Add Column
            </button>
          </div>

          <div className="space-y-3">
            {cols.map((c, i) => (
              <div key={i} className="border rounded p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      className={`w-full px-3 py-2 border rounded ${
                        errors[`col_${i}_name`]
                          ? "border-red-300"
                          : "border-gray-300"
                      }`}
                      value={c.name}
                      onChange={(e) =>
                        update(i, "name", e.target.value.toLowerCase())
                      }
                      placeholder="column_name"
                      disabled={loading}
                    />
                    {errors[`col_${i}_name`] && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors[`col_${i}_name`]}
                      </p>
                    )}
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Type
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      value={c.type}
                      onChange={(e) => update(i, "type", e.target.value)}
                      disabled={loading}>
                      {TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Nullable */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={!!c.nullable}
                        onChange={(e) =>
                          update(i, "nullable", e.target.checked)
                        }
                        className="mr-2"
                        disabled={loading}
                      />
                      Nullable
                    </label>
                  </div>

                  {/* Default */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Default
                    </label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                      placeholder="optional"
                      value={c.default || ""}
                      onChange={(e) => update(i, "default", e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  {/* Remove */}
                  <div>
                    <button
                      type="button"
                      onClick={() => remove(i)}
                      disabled={cols.length === 1 || loading}
                      className="px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50 disabled:opacity-50">
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="text-sm text-blue-800">
            <strong>Auto-generated columns:</strong> id (primary key),
            created_at, updated_at
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => nav("/admin/tables")}
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
            disabled={loading}>
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || cols.length === 0}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50">
            {loading ? "Creating..." : "Create Table"}
          </button>
        </div>
      </form>
    </div>
  );
}
