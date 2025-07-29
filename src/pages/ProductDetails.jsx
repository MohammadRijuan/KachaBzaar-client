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
      const res = await axios.get(`http://localhost:5000/products/${id}`);
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
      await axios.post("http://localhost:5000/cart", cartItem);
      Swal.fire("Added!", "Product added to cart", "success");
    } catch (error) {
      Swal.fire("Error", "Failed to add to cart", "error");
      console.log(error)
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

  if (isLoading) return <p className="text-center">Loading...</p>;
  if (isError || !product) return <p className="text-center text-red-500">Product not found.</p>;

  const isVendorOwner = user?.email === product?.vendorEmail;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{product.itemName}</h2>
      <img src={product.image} alt={product.itemName} className="w-full h-64 object-cover rounded mb-4" />
      <p><strong>Market:</strong> {product.marketName}</p>
      <p><strong>Vendor:</strong> {product.vendorName || product.vendorEmail}</p>
      <p><strong>Price:</strong> ৳{product.pricePerUnit}</p>
      <p><strong>Date:</strong> {product.date}</p>
      <p><strong>Description:</strong> {product.itemDescription || "N/A"}</p>
      <p><strong>Market Info:</strong> {product.marketDescription}</p>

      <div className="mt-4">
        <h3 className="font-semibold">Price History:</h3>
        <ul className="list-disc pl-4">
          {product.prices?.map((entry, idx) => (
            <li key={idx}>{entry.date} - ৳{entry.price}</li>
          ))}
        </ul>
      </div>

      <div className="mt-6 flex gap-4">
        <button onClick={handleAddToCart} className="btn btn-outline btn-success">
          🛒 Add to Cart
        </button>
        <button onClick={handleBuyNow} className="btn btn-primary">
          💳 Buy Now
        </button>
        {isVendorOwner && (
          <button onClick={handleUpdate} className="btn btn-warning">
            ✏️ Update Product
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
