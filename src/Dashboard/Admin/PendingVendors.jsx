import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const PendingVendors = () => {
  const axiosSecure = useAxiosSecure();

  const { data: vendors = [], refetch } = useQuery({
    queryKey: ["pendingVendors"],
    queryFn: async () => {
      const res = await axiosSecure.get("/users/vendors/pending");
      return res.data;
    },
  });

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ id, approve }) =>
      await axiosSecure.patch(`/users/${id}/vendor-status`, {
        status: approve ? "approved" : "rejected",
      }),
    onSuccess: () => {
      refetch();
      Swal.fire("Success", "Vendor status updated", "success");
    },
  });

  const handleDecision = (id, approve) => {
    updateStatus({ id, approve }).catch(() =>
      Swal.fire("Error", "Failed to update", "error")
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Vendor Requests</h2>
      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead>
            <tr>
              <th>Email</th>
              <th>Shop</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((v) => (
              <tr key={v._id}>
                <td>{v.email}</td>
                <td>{v.vendorInfo?.shopName}</td>
                <td>{v.vendorInfo?.phone}</td>
                <td>
                  <button className="btn btn-success btn-sm mr-2" onClick={() => handleDecision(v._id, true)}>
                    Approve
                  </button>
                  <button className="btn btn-error btn-sm" onClick={() => handleDecision(v._id, false)}>
                    Reject
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

export default PendingVendors;
