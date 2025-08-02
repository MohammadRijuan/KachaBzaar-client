import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/useAuth";

const MyWatchlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const normalizedEmail = user?.email?.trim().toLowerCase();

  const { data: watchlist = [], isLoading } = useQuery({
    queryKey: ["watchlist", normalizedEmail],
    queryFn: async () => {
      const res = await axios.get(
        `https://kacha-bazaar-server.vercel.app/cart?email=${normalizedEmail}`
      );
      return res.data;
    },
    enabled: !!normalizedEmail,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(
        `https://kacha-bazaar-server.vercel.app/cart/${id}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlist", normalizedEmail]);
      Swal.fire("Deleted", "Item removed from watchlist", "success");
    },
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({ id, quantity }) => {
      return await axios.patch(
        `https://kacha-bazaar-server.vercel.app/cart/${id}`,
        { quantity }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["watchlist", normalizedEmail]);
    },
  });

  const handleRemove = (id) => {
    deleteMutation.mutate(id);
  };

  const handleQuantityChange = (id, currentQty, direction) => {
    const newQty = direction === "inc" ? currentQty + 1 : currentQty - 1;
    if (newQty < 1) return;
    updateQuantityMutation.mutate({ id, quantity: newQty });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">👀 My Watchlist</h2>

      {!normalizedEmail ? (
        <p className="text-center">Loading user...</p>
      ) : isLoading ? (
        <p className="text-center">Loading...</p>
      ) : watchlist.length === 0 ? (
        <p className="text-center text-gray-500">Your watchlist is empty.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th>Image</th>
                <th>Item</th>
                <th>Price (৳)</th>
                <th>Quantity</th>
                <th>Total (৳)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {watchlist.map((item) => (
                <tr key={item._id}>
                  <td>
                    <img
                      src={item.image}
                      alt={item.itemName}
                      className="w-16 h-16 rounded"
                    />
                  </td>
                  <td>{item.itemName}</td>
                  <td>{item.price}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity, "dec")}
                        className="btn btn-xs"
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item._id, item.quantity, "inc")}
                        className="btn btn-xs"
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{(item.price * item.quantity).toFixed(2)}</td>
                  <td className="space-x-2">
                    <button
                      onClick={() => navigate(`/product/${item.productId}`)}
                      className="btn btn-sm btn-info"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleRemove(item._id)}
                      className="btn btn-sm btn-error"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/all-product")}
              className="btn btn-success"
            >
              ➕ Add More Products
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyWatchlist;