// React Query hook to fetch list of provisioned tables for the admin landing page
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../api/client";

export function useTables() {
  return useQuery({
    queryKey: ["tables"],
    queryFn: async () => (await api.get("/provision/tables")).data,
  });
}

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableName) => {
      const response = await api.delete(`/provision/table/${tableName}`);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the tables list
      queryClient.invalidateQueries({ queryKey: ["tables"] });
    },
  });
}
