import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";

export default function TableAdmin() {
  const { table } = useParams();
  const [meta, setMeta] = useState(null);
  const [rows, setRows] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("asc");
  const [total, setTotal] = useState(0);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    (async () => {
      const res = await api.get("/provision/tables");
      setMeta(res.data.find((x) => x.tableName === table));
    })();
  }, [table]);

  async function load() {
    const { data } = await api.get(`/api/${table}`, {
      params: { q: query, page, pageSize, sort, order },
    });
    setRows(data.data);
    setTotal(data.total);
  }
  useEffect(() => {
    if (meta) load();
  }, [meta, query, page, pageSize, sort, order]);

  async function save(form) {
    if (form.id) await api.put(`/api/${table}/${form.id}`, strip(form));
    else await api.post(`/api/${table}`, strip(form));
    setEditing(null);
    load();
  }
  async function del(id) {
    if (!confirm("Delete this row?")) return;
    await api.delete(`/api/${table}/${id}`);
    load();
  }
  const cols = meta?.definition?.columns || [];

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">{table}</h1>
      <div className="flex items-center gap-2">
        <input
          className="border rounded px-3 py-2"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          onClick={() => setEditing({})}
          className="px-3 py-2 bg-black text-white rounded">
          Add
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full border mt-3">
          <thead>
            <tr>
              <Th
                col="id"
                sort={sort}
                order={order}
                setSort={setSort}
                setOrder={setOrder}
              />
              {cols.map((c) => (
                <Th
                  key={c.name}
                  col={c.name}
                  sort={sort}
                  order={order}
                  setSort={setSort}
                  setOrder={setOrder}
                />
              ))}
              <th className="p-2 border">actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="p-2 border">{r.id}</td>
                {cols.map((c) => (
                  <td className="p-2 border" key={c.name}>
                    {fmt(r[c.name], c.type)}
                  </td>
                ))}
                <td className="p-2 border">
                  <button
                    className="text-blue-600 mr-2"
                    onClick={() => setEditing(r)}>
                    Edit
                  </button>
                  <button className="text-red-600" onClick={() => del(r.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={page <= 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-2 py-1 border rounded">
          Prev
        </button>
        <div>
          Page {page} / {Math.max(1, Math.ceil(total / pageSize))}
        </div>
        <button
          disabled={page * pageSize >= total}
          onClick={() => setPage((p) => p + 1)}
          className="px-2 py-1 border rounded">
          Next
        </button>
      </div>
      {editing && (
        <Editor
          meta={meta}
          value={editing}
          onClose={() => setEditing(null)}
          onSave={save}
        />
      )}
    </div>
  );
}

function Th({ col, sort, order, setSort, setOrder }) {
  const active = sort === col;
  return (
    <th
      onClick={() => {
        if (active) setOrder(order === "asc" ? "desc" : "asc");
        else {
          setSort(col);
          setOrder("asc");
        }
      }}
      className="p-2 border cursor-pointer">
      {col}
      {active ? (order === "asc" ? " ↑" : " ↓") : ""}
    </th>
  );
}
function fmt(v, t) {
  if (v == null) return "";
  if (t === "boolean") return v ? "true" : "false";
  return String(v);
}
function strip(o) {
  const x = { ...o };
  delete x.created_at;
  delete x.updated_at;
  return x;
}

function Editor({ meta, value, onClose, onSave }) {
  const cols = meta.definition.columns;
  const [form, setForm] = useState(value);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 rounded w-full max-w-lg space-y-3">
        <div className="text-lg font-semibold">
          {value?.id ? "Edit" : "Create"}
        </div>
        {cols.map((c) => (
          <div key={c.name} className="space-y-1">
            <label className="text-sm">{c.name}</label>
            {inputFor(c, form[c.name], (v) => set(c.name, v))}
          </div>
        ))}
        <div className="flex gap-2 justify-end">
          <button onClick={onClose} className="px-3 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-3 py-2 bg-black text-white rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
function inputFor(c, val, set) {
  switch (c.type) {
    case "text":
      return (
        <textarea
          className="border rounded px-3 py-2 w-full"
          value={val || ""}
          onChange={(e) => set(e.target.value)}
        />
      );
    case "integer":
    case "decimal":
      return (
        <input
          type="number"
          className="border rounded px-3 py-2 w-full"
          value={val ?? ""}
          onChange={(e) =>
            set(e.target.value === "" ? null : Number(e.target.value))
          }
        />
      );
    case "boolean":
      return (
        <input
          type="checkbox"
          checked={!!val}
          onChange={(e) => set(e.target.checked ? 1 : 0)}
        />
      );
    case "date":
      return (
        <input
          type="date"
          className="border rounded px-3 py-2 w-full"
          value={val ? String(val).slice(0, 10) : ""}
          onChange={(e) => set(e.target.value)}
        />
      );
    case "datetime":
      return (
        <input
          type="datetime-local"
          className="border rounded px-3 py-2 w-full"
          value={val ? String(val).replace("Z", "").slice(0, 19) : ""}
          onChange={(e) => set(e.target.value.replace("T", " "))}
        />
      );
    default:
      return (
        <input
          className="border rounded px-3 py-2 w-full"
          value={val || ""}
          onChange={(e) => set(e.target.value)}
        />
      );
  }
}
