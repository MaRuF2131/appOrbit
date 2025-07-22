import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../utils/axios";
import Swal from "sweetalert2";

export const useCoupons = () => {
  const queryClient = useQueryClient();


  // Fetch coupons
  const { data: coupons = [], isLoading } = useQuery({
    queryKey: ["coupons"],
    queryFn: async () => {
      const res = await axiosInstance.get("/admin/coupons");
      return res.data;
    },
  });

  // Add new coupon
  const addCoupon = useMutation({
    mutationFn: async (newCoupon) => await axiosInstance.post("/admin/coupons", newCoupon),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire({
        icon: "success",
        title: "Coupon Added!",
        text: "Your coupon has been successfully created.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to Add Coupon",
        text: error?.response?.data?.message || "Something went wrong.",
      });
    },
  });

  // Delete coupon
  const deleteCoupon = useMutation({
    mutationFn: async (id) => axiosInstance.delete(`/admin/coupons/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire({
        icon: "success",
        title: "Coupon Deleted!",
        text: "The coupon has been removed successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to Delete Coupon",
        text: error?.response?.data?.message || "Something went wrong.",
      });
    },
  });

  // Update coupon
  const updateCoupon = useMutation({
    mutationFn: async ({ id, updatedData }) =>
      axiosInstance.patch(`/admin/coupons/${id}`, updatedData),
    onSuccess: () => {
      queryClient.invalidateQueries(["coupons"]);
      Swal.fire({
        icon: "success",
        title: "Coupon Updated!",
        text: "Your coupon has been successfully updated.",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: (error) => {
      Swal.fire({
        icon: "error",
        title: "Failed to Update Coupon",
        text: error?.response?.data?.message || "Something went wrong.",
      });
    },
  });

  return { coupons, isLoading, addCoupon, deleteCoupon, updateCoupon };
};
