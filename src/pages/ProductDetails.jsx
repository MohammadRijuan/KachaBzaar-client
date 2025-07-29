import { useParams, useNavigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`https://kacha-bazaar-server.vercel.app/products/${id}`);
      return res.data;
    },
  });

  const handleAddToCart = async () => {
    if (!user) {
      return Swal.fire("Login required", "Please log in to add to cart", "info");
    }

    const cartItem = {
      productId: product._id,
      email: user.email,
      quantity: 1,
    };

    try {
      await axios.post("https://kacha-bazaar-server.vercel.app/cart", cartItem);
      Swal.fire("Added!", "Product added to cart", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add to cart", "error");
      console.log(error);
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      return Swal.fire("Login required", "Please log in to proceed", "info");
    }
    // navigate(`/payment/${product._id}`);
  };

  const handleUpdate = () => {
    navigate(`/dashboard/update-product/${product._id}`);
  };

  if (isLoading) return <p className="text-center text-lg mt-10">Loading...</p>;
  if (isError || !product)
    return <p className="text-center text-red-500 mt-10">Product not found.</p>;

  const isVendorOwner = user?.email === product?.vendorEmail;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Section */}
        <div>
          <img
            src={product.image}
            alt={product.itemName}
            className="w-full h-72 object-cover rounded-lg shadow-sm"
          />
        </div>

        {/* Details Section */}
        <div>
          <h2 className="text-3xl font-bold mb-2 text-green-700">{product.itemName}</h2>
          <p className="text-lg text-gray-600 mb-4">{product.itemDescription || "No description available."}</p>

          <div className="space-y-2 text-sm text-gray-700">
            <p><strong>Market:</strong> {product.marketName}</p>
            <p><strong>Vendor:</strong> {product.vendorName || product.vendorEmail}</p>
            <p><strong>Price:</strong> <span className="text-xl font-semibold text-green-600">৳{product.pricePerUnit}</span></p>
            <p><strong>Date:</strong> {product.date}</p>
            <p><strong>Market Info:</strong> {product.marketDescription}</p>
          </div>

          {/* Price History */}
          {product.prices?.length > 0 && (
            <div className="mt-5">
              <h3 className="font-semibold mb-1">📈 Price History:</h3>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {product.prices.map((entry, idx) => (
                  <li key={idx}>{entry.date} — ৳{entry.price}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-4">
            <button
              onClick={handleAddToCart}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md shadow transition"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleBuyNow}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md shadow transition"
            >
              💳 Buy Now
            </button>
            {isVendorOwner && (
              <button
                onClick={handleUpdate}
                className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-md shadow transition"
              >
                ✏️ Update Product
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
