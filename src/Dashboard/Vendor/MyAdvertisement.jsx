import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useAuth from "../../hooks/useAuth";
import AddAdvertisement from "./AddAdvertisement";

const MyAdvertisement = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingAd, setEditingAd] = useState(null);

  // Fetch ads created by current vendor
  const { data: myAds = [], isLoading } = useQuery({
    queryKey: ["myAdvertisements", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/advertisements?vendorEmail=${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/advertisements/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myAdvertisements", user.email]);
      Swal.fire("Deleted!", "Advertisement deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete advertisement.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This ad will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="p-6 overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4">My Advertisements</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : myAds.length === 0 ? (
        <p>No advertisements found.</p>
      ) : (
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th>Image</th>
              <th>Title</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {myAds.map((ad) => (
              <tr key={ad._id}>
                <td>
                  <img src={ad.image} alt={ad.title} className="w-16 h-16 object-cover rounded" />
                </td>
                <td>{ad.title}</td>
                <td>
                  <span
                    className={`badge ${ad.status === "approved"
                        ? "badge-success"
                        : ad.status === "pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                  >
                    {ad.status}
                  </span>
                </td>
                <td>{new Date(ad.createdAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  {ad.status === "approved" && (
                    <button
                      onClick={() => setEditingAd(ad)}
                      className="btn btn-xs btn-outline btn-info"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(ad._id)}
                    className="btn btn-xs btn-outline btn-error"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Modal for Editing */}
      {editingAd && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[400px] shadow-md relative">
            <button
              onClick={() => setEditingAd(null)}
              className="absolute top-2 right-2 text-red-600"
            >
              ✕
            </button>
            <h3 className="text-lg font-semibold mb-4">Update Advertisement</h3>
            <AddAdvertisement existingAd={editingAd} closeModal={() => setEditingAd(null)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyAdvertisement;
