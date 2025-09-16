// Landing/admin page that lists provisioned tables as cards
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDeleteTable, useTables } from "../hooks/useTables";

export default function TablesList() {
  const { data, isLoading, error } = useTables();
  const deleteTable = useDeleteTable();
  const [deletingTable, setDeletingTable] = useState(null);

  const handleDeleteTable = async (tableName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the table "${tableName}"? This action cannot be undone.`
      )
    ) {
      setDeletingTable(tableName);
      try {
        await deleteTable.mutateAsync(tableName);
        // Success message could be added here
      } catch (error) {
        alert(`Failed to delete table: ${error.message}`);
      } finally {
        setDeletingTable(null);
      }
    }
  };

  if (isLoading) return <div className="p-6">Loading tables...</div>;

  if (error) {
    return (
      <div className="p-6">
        <div className="text-red-600 mb-4">
          Error loading tables: {error.message}
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tables</h1>
        <Link
          to="/admin/new"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          + New Table
        </Link>
      </div>

      {!data || data.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No tables created yet</p>
          <Link
            to="/admin/new"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Create First Table
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {data.map((table) => (
            <div
              key={table.tableName}
              className="border rounded-lg p-4 hover:shadow-md">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-medium">{table.tableName}</h3>
                  <p className="text-sm text-gray-500">
                    {table.definition?.columns?.length || 0} columns
                  </p>
                </div>
                <div className="space-y-2">
                  <Link
                    to={`/admin/${table.tableName}`}
                    className="manage-button block text-center">
                    Manage
                  </Link>
                  <button
                    onClick={() => handleDeleteTable(table.tableName)}
                    disabled={deletingTable === table.tableName}
                    className="delete-button w-full">
                    {deletingTable === table.tableName
                      ? "Deleting..."
                      : "Delete"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">COLUMNS</p>
                <div className="flex flex-wrap gap-1">
                  {table.definition?.columns?.slice(0, 3).map((column) => (
                    <span
                      key={column.name}
                      className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                      {column.name}
                    </span>
                  ))}
                  {table.definition?.columns?.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                      +{table.definition.columns.length - 3}
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                Created {new Date(table.created_at).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
