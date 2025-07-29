import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useMutation } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router";

const BeVendor = () => {
  const axiosSecure = useAxiosSecure();
  const { register, handleSubmit, reset } = useForm();
  const {user} = useAuth()
  const navigate = useNavigate()

  const { mutateAsync } = useMutation({
    mutationFn: async (data) => {
      const res = await axiosSecure.patch("/users/vendor-request", data);
      return res.data;
    },
    onSuccess: () => {
      Swal.fire("Submitted", "Vendor request sent!", "success");
      reset();
      navigate('/')
    },
  });

  const onSubmit = (data) => {
    mutateAsync(data).catch(() => {
      Swal.fire("Error", "Could not submit request", "error");
    });
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-xl font-bold mb-4">Become a Vendor</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input {...register("email")} placeholder="Email" defaultValue={user?.email} className="input input-bordered w-full" />
        <input {...register("shopName")} placeholder="Shop Name" className="input input-bordered w-full" />
        <input {...register("phone")} placeholder="Phone Number" className="input input-bordered w-full" />
        <button type="submit" className="btn btn-primary w-full">Submit Request</button>
      </form>
    </div>
  );
};

export default BeVendor;
