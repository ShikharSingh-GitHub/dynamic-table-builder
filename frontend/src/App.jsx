import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import TableAdmin from "./pages/TableAdmin";
import TableBuilder from "./pages/TableBuilder";
import TablesList from "./pages/TablesList";

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <BrowserRouter>
        <nav className="border-b bg-white p-4">
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Link
              to="/admin/tables"
              className="text-xl font-semibold hover:text-blue-600">
              Dynamic Table Builder
            </Link>
            <span className="text-sm text-gray-500">v1.0</span>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/tables" />} />
          <Route path="/admin/tables" element={<TablesList />} />
          <Route path="/admin/new" element={<TableBuilder />} />
          <Route path="/admin/:table" element={<TableAdmin />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
