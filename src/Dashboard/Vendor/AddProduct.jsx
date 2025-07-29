import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import { useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useNavigate } from "react-router";

const AddProduct = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  });

  const navigate = useNavigate()

  console.log(user)

  const { mutateAsync } = useMutation({
    mutationFn: async (data) => {
      const productData = {
        ...data,
        vendorEmail: user.email,
        vendorName: user.displayName,
        date,
        status: "pending",
        prices: [{ date, price: Number(data.pricePerUnit) }]
      };
      const res = await axiosSecure.post("/products", productData);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Success", "Product submitted for review!", "success");
      reset();
      navigate('/')
    }
  });

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add Product</h2>
      <form onSubmit={handleSubmit(mutateAsync)} className="space-y-4">
        <input
          className="input input-bordered w-full"
          value={user?.email}
          readOnly
        />

        <input
          className="input input-bordered w-full"
          value={user?.displayName}
          readOnly
        />

        <input
  {...register("marketName")}
  defaultValue={user?.vendorInfo?.shopName || ""}
  className="input input-bordered w-full"
  placeholder="Market Name"
  required
/>

        <input
          type="date"
          className="input input-bordered w-full"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <textarea
          {...register("marketDescription")}
          className="textarea textarea-bordered w-full"
          placeholder="Market Description"
          required
        />

        <input
          {...register("itemName")}
          className="input input-bordered w-full"
          placeholder="Item Name"
          required
        />

        <input
          {...register("image")}
          className="input input-bordered w-full"
          placeholder="Product Image URL"
          required
        />

        <input
          {...register("pricePerUnit")}
          type="number"
          className="input input-bordered w-full"
          placeholder="Price per Unit (e.g., ৳30/kg)"
          required
        />

        <textarea
          {...register("itemDescription")}
          className="textarea textarea-bordered w-full"
          placeholder="Item Description (optional)"
        />

        <button type="submit" className="btn btn-primary w-full">
          Submit Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
