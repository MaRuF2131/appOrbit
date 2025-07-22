import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";

export const useSearchProducts = (query, page) => {
  return useQuery({
    queryKey: ["products", query, page],
    queryFn: async () => {
      const res = await axiosInstance.get(`products/search`, {
        params: { query, page }
      });
      return res.data;
    },
    keepPreviousData: true,
  });
};
