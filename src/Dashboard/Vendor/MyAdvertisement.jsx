import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import AddAdvertisement from "./AddAdvertisement";

const MyAdvertisements = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [editingAd, setEditingAd] = useState(null);

  const { data: ads = [] } = useQuery({
    queryKey: ["myAdvertisements"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/advertisements?vendorEmail=${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => await axiosSecure.delete(`/advertisements/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["myAdvertisements"]);
      Swal.fire("Deleted!", "Advertisement has been deleted.", "success");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This ad will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) deleteMutation.mutate(id);
    });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Advertisements</h2>

      {editingAd && (
        <dialog id="edit_modal" className="modal modal-open">
          <div className="modal-box">
            <AddAdvertisement existingAd={editingAd} closeModal={() => setEditingAd(null)} />
          </div>
        </dialog>
      )}

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td><span className="badge">{ad.status}</span></td>
                <td className="space-x-2">
                  <button onClick={() => setEditingAd(ad)} className="btn btn-info btn-sm">Update</button>
                  <button onClick={() => handleDelete(ad._id)} className="btn btn-error btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyAdvertisements;
