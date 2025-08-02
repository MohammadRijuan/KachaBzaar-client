import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Swal from "sweetalert2";
import useAuth from "../hooks/useAuth";
import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  // Fetch product
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await axios.get(`https://kacha-bazaar-server.vercel.app/products/${id}`);
      return res.data;
    },
  });

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", id],
    queryFn: async () => {
      const res = await axios.get(`https://kacha-bazaar-server.vercel.app/reviews?productId=${id}`);
      return res.data;
    },
  });

  // Add to cart
  const handleAddToCart = async () => {
    if (!user) {
      return Swal.fire("Login required", "Please log in to add to cart", "info");
    }

    const cartItem = {
      productId: product._id,
      email: user.email,
      quantity: 1,
      itemName: product.itemName,
      image: product.image,
      price: product.pricePerUnit,
    };

    try {
      const res = await axios.post("https://kacha-bazaar-server.vercel.app/cart", cartItem);
      Swal.fire("Added!", res.data.message || "Product added to watchlist", "success");
    } catch (error) {
      console.log(error);
      Swal.fire("Error", "Failed to add to cart", "error");
    }
  };

  const handleBuyNow = () => {
    if (!user) {
      return Swal.fire("Login required", "Please log in to proceed", "info");
    }
    // Add navigation logic here if payment is implemented
  };

  const handleUpdate = () => {
    navigate(`/dashboard/update-product/${product._id}`);
  };

  const reviewMutation = useMutation({
    mutationFn: async (reviewData) => {
      return await axios.post("https://kacha-bazaar-server.vercel.app/reviews", reviewData);
    },
    onSuccess: () => {
      Swal.fire("Thanks!", "Your review has been submitted.", "success");
      queryClient.invalidateQueries(["reviews", id]);
      setRating(0);
      setComment("");
    },
    onError: () => {
      Swal.fire("Error", "Failed to submit review", "error");
    },
  });

  const handleSubmitReview = () => {
    if (!user) return Swal.fire("Login required", "Please log in to review", "info");

    if (rating < 1 || rating > 5 || !comment) {
      return Swal.fire("Invalid", "Please provide a rating (1–5) and comment", "warning");
    }

    reviewMutation.mutate({
      productId: id,
      userEmail: user.email,
      userName: user.displayName || user.email,
      rating,
      comment,
      date: new Date().toISOString(),
    });
  };

  const getPriceComparisonData = (product) => {
    if (!product?.prices?.length) return [];

    const prices = product.prices.map(p => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);

    return [
      { name: "Current", price: product.pricePerUnit },
      { name: "Average", price: parseFloat(avgPrice.toFixed(2)) },
      { name: "Max", price: maxPrice },
      { name: "Min", price: minPrice },
    ];
  };

  if (isLoading) return <p className="text-center text-lg mt-10">Loading...</p>;
  if (isError || !product)
    return <p className="text-center text-red-500 mt-10">Product not found.</p>;

  const isVendorOwner = user?.email === product?.vendorEmail;
  const comparisonData = getPriceComparisonData(product);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-xl mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image */}
        <div>
          <img
            src={product.image}
            alt={product.itemName}
            className="w-full h-72 object-cover rounded-lg shadow-sm"
          />
        </div>

        {/* Details */}
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

      {/* Price Trend Chart */}
      {product.prices?.length > 1 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">📈 Price Trend Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={product.prices}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="price"
                name="Price (৳)"
                stroke="#16a34a"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Price Comparison Chart */}
      {comparisonData.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold mb-4">📊 Price Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#3b82f6"
                strokeWidth={3}
                name="৳ Price"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Reviews */}
      <div className="mt-10 border-t pt-6">
        <h3 className="text-xl font-semibold mb-4">🗣 Customer Reviews</h3>
        {reviews.length === 0 ? (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r, i) => (
              <li key={i} className="border p-4 rounded shadow-sm">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{r.userName}</p>
                    <p className="text-xs text-gray-500">{r.userEmail}</p>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(r.date).toLocaleDateString()}
                  </p>
                </div>
                <p className="text-yellow-500">{"⭐".repeat(r.rating)}</p>
                <p className="text-gray-700 mt-2">{r.comment}</p>
              </li>
            ))}
          </ul>
        )}

        {/* Review Form */}
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Leave a Review</h4>
          <div className="flex gap-2 items-center mb-2">
            <span>Rating:</span>
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={`text-xl ${num <= rating ? "text-yellow-500" : "text-gray-300"}`}
              >
                ★
              </button>
            ))}
          </div>
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your feedback..."
            className="w-full border rounded p-2 mb-2"
          />
          <button
            onClick={handleSubmitReview}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
