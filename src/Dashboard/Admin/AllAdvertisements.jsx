import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";


const AllAdvertisements = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const { data: ads = [], isLoading } = useQuery({
    queryKey: ["allAdvertisements"],
    queryFn: async () => {
      const res = await axiosSecure.get("/advertisements");
      return res.data;
    },
  });

  const approveMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.patch(`/advertisements/${id}`, { status: "approved" });
    },
    onSuccess: () => {
      Swal.fire("Approved!", "Advertisement approved successfully!", "success");
      queryClient.invalidateQueries(["allAdvertisements"]);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/advertisements/${id}`);
    },
    onSuccess: () => {
      Swal.fire("Deleted!", "Advertisement deleted successfully!", "success");
      queryClient.invalidateQueries(["allAdvertisements"]);
    },
  });

  const handleApprove = (id) => {
    Swal.fire({
      title: "Approve this ad?",
      showCancelButton: true,
      confirmButtonText: "Yes, approve",
    }).then((res) => {
      if (res.isConfirmed) approveMutation.mutate(id);
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete this ad?",
      text: "You won’t be able to recover this.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    }).then((res) => {
      if (res.isConfirmed) deleteMutation.mutate(id);
    });
  };

  if (isLoading) return <p>Loading advertisements...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Advertisements (Admin View)</h2>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Vendor</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ads.map((ad) => (
              <tr key={ad._id}>
                <td>{ad.title}</td>
                <td>{ad.description}</td>
                <td>
                  <span className={`badge ${ad.status === "approved" ? "badge-success" : "badge-warning"}`}>
                    {ad.status}
                  </span>
                </td>
                <td>{ad.vendorEmail}</td>
                <td>
                  <img src={ad.image} alt="Ad" className="w-16 h-12 object-cover rounded" />
                </td>
                <td className="space-x-2">
                  {ad.status !== "approved" && (
                    <button onClick={() => handleApprove(ad._id)} className="btn btn-success btn-sm">
                      Approve
                    </button>
                  )}
                  <button onClick={() => handleDelete(ad._id)} className="btn btn-error btn-sm">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllAdvertisements;
