import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router";


const AddAdvertisement = ({ existingAd, closeModal }) => {
  const navigate = useNavigate()
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset } = useForm({
    defaultValues: existingAd || {
      title: "",
      description: "",
      image: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const adData = {
        ...data,
        vendorEmail: user.email,
        vendorName: user.displayName,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      if (existingAd) {
        const { _id, ...adDataToUpdate } = adData;
        const res = await axiosSecure.patch(`/advertisements/${existingAd._id}`, adDataToUpdate);
        return res.data;
      }
      else {
        const res = await axiosSecure.post("/advertisements", adData);
        return res.data;
      }
    },
    onSuccess: () => {
      Swal.fire("Success", existingAd ? "Advertisement updated!" : "Advertisement submitted!", "success");
      queryClient.invalidateQueries(["myAdvertisements"]);
      navigate('/dashboard/my-advertisement')
      reset();
      closeModal && closeModal();
    },
  });

  return (
    <form onSubmit={handleSubmit(mutation.mutate)} className="space-y-4 p-4">
      <input {...register("title", { required: true })} className="input input-bordered w-full" placeholder="Ad Title" />
      <textarea {...register("description", { required: true })} className="textarea textarea-bordered w-full" placeholder="Short Description" />
      <input {...register("image", { required: true })} className="input input-bordered w-full" placeholder="Image URL" />
      <button type="submit" className="btn btn-primary w-full">
        {existingAd ? "Update Ad" : "Submit Advertisement"}
      </button>
    </form>
  );
};

export default AddAdvertisement;
