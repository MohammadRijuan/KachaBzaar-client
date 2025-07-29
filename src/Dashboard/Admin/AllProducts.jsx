import { useQuery, useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const AllProducts = () => {
  const axiosSecure = useAxiosSecure();

  // Fetch all products
  const { data: products = [], refetch } = useQuery({
    queryKey: ["allProducts"],
    queryFn: async () => {
      const res = await axiosSecure.get("/products");
      return res.data;
    },
  });

  // Mutation to update status (approve)
  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: async ({ id, status }) => {
      return await axiosSecure.patch(`/products/${id}/status`, { status });
    },
    onSuccess: () => {
      refetch();
    },
  });

  // Approve a product
  const handleStatusChange = async (id, status) => {
    const result = await Swal.fire({
      title: `Confirm ${status}?`,
      showCancelButton: true,
      confirmButtonText: "Yes",
    });

    if (result.isConfirmed) {
      await updateStatus({ id, status });
      Swal.fire("Updated", `Product ${status}`, "success");
    }
  };

  // Delete a product
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await axiosSecure.delete(`/products/${id}`);
        if (res.data.deletedCount > 0) {
          Swal.fire("Deleted!", "Product has been deleted.", "success");
          refetch();
        } else {
          Swal.fire("Failed!", "Product was not deleted.", "error");
        }
      } catch (error) {
        console.error("Delete error:", error);
        Swal.fire("Error", "An error occurred while deleting the product.", "error");
      }
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Products (Admin View)</h2>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <div key={p._id} className="card bg-base-100 shadow-md p-4">
            <img
              src={p.image}
              alt={p.itemName}
              className="w-full h-48 object-cover rounded"
            />
            <h3 className="text-xl font-bold mt-2">{p.itemName}</h3>
            <p><strong>Market:</strong> {p.marketName}</p>
            <p><strong>Vendor:</strong> {p.vendorEmail}</p>
            <p><strong>Price:</strong> ৳{p.pricePerUnit}</p>
            <p>
              <strong>Status:</strong>{" "}
              <span className="badge badge-info">{p.status}</span>
            </p>
            <div className="mt-3 flex gap-2">
              <button
                className="btn btn-success btn-sm"
                onClick={() => handleStatusChange(p._id, "approved")}
              >
                Approve
              </button>
              <button
                className="btn btn-error btn-sm"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProducts;
