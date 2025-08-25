// React Query hook to fetch list of provisioned tables for the admin landing page
import { useQuery } from "@tanstack/react-query";
import { api } from "../api/client";

export function useTables() {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => (await api.get("/provision/tables")).data,
  });
}
