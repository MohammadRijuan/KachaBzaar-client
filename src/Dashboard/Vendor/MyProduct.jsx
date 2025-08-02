import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useState } from "react";
import Swal from "sweetalert2";

const MyProduct = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [selectedProduct, setSelectedProduct] = useState(null);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["myProducts", user?.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/vendor/${user.email}`);
      return res.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["myProducts", user.email]);
      Swal.fire("Deleted!", "Product has been deleted.", "success");
    },
    onError: () => {
      Swal.fire("Error!", "Failed to delete product.", "error");
    },
  });

  const handleDelete = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
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
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      {isLoading ? (
        <p>Loading...</p>
      ) : products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <table className="table w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  <img src={p.image} alt={p.itemName} className="w-16 h-16 object-cover rounded" />
                </td>
                <td>{p.itemName}</td>
                <td>৳{p.pricePerUnit}</td>
                <td>
                  <span
                    className={`badge ${p.status === "approved"
                        ? "badge-success"
                        : p.status === "pending"
                          ? "badge-warning"
                          : "badge-error"
                      }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td>{new Date(p.date).toLocaleDateString()}</td>
                <td className="space-x-2">
                  {/* Edit functionality — can expand this */}
                  <button
                    onClick={() => setSelectedProduct(p)}
                    className="btn btn-xs btn-outline btn-info"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p._id)}
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

      {/* Modal for editing */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96 shadow-md">
            <h3 className="text-lg font-semibold mb-4">Edit Product</h3>

            {/* Example Form: Only itemName editable for now */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const updatedItem = {
                  itemName: e.target.name.value,
                  pricePerUnit: parseFloat(e.target.price.value),
                  date: new Date().toISOString().split("T")[0], // Sets today's date in YYYY-MM-DD
                };

                axiosSecure
                  .patch(`/products/${selectedProduct._id}`, updatedItem)
                  .then(() => {
                    queryClient.invalidateQueries(["myProducts", user.email]);
                    Swal.fire("Success", "Product updated", "success");
                    setSelectedProduct(null);
                  })
                  .catch(() => {
                    Swal.fire("Error", "Update failed", "error");
                  });
              }}
            >
              <label className="block text-sm font-medium mb-1">Product Name</label>
              <input
                type="text"
                name="name"
                defaultValue={selectedProduct.itemName}
                className="input input-bordered w-full mb-3"
                required
              />

              <label className="block text-sm font-medium mb-1">Price (৳)</label>
              <input
                type="number"
                name="price"
                defaultValue={selectedProduct.pricePerUnit}
                className="input input-bordered w-full mb-3"
                step="0.01"
                min="0"
                required
              />

              {/* You don't need to show a date field if it's always today's date, but you could display it: */}
              <p className="text-sm text-gray-500 mb-3">Date will be updated to: {new Date().toLocaleDateString()}</p>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedProduct(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyProduct;
