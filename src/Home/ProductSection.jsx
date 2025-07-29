import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router';

const ProductSection = () => {

    const navigate = useNavigate()

    const { data: productsData, isLoading, isError } = useQuery({
        queryKey: ["approvedProducts"],
        queryFn: async () => {
            const res = await axios.get("https://kacha-bazaar-server.vercel.app/approved-products");
            console.log("Approved products response:", res.data);
            return res.data;
        },
    });

    // Fallback if not an array
    const products = Array.isArray(productsData) ? productsData : [];

    if (isLoading) return <p className="text-center">Loading...</p>;
    if (isError) return <p className="text-center text-red-500">Failed to load products.</p>;
    if (products.length === 0) return <p className="text-center">No approved products yet.</p>;

    const sliceProduct = products.slice(0,6)

    return (
        <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">Market Products</h2>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {sliceProduct.map((p) => (
                    <div key={p._id} className="card bg-base-100 shadow-md p-4">
                        <img
                            src={p.image}
                            alt={p.itemName}
                            className="w-full h-48 object-cover rounded"
                        />
                        <h3 className="text-xl font-bold">{p.itemName}</h3>
                        <p>Market: {p.marketName}</p>
                        <p>Vendor: {p.vendorName || p.vendorEmail}</p>
                        <p>Price: ৳{p.pricePerUnit}</p>
                        <p className="text-sm text-gray-500">Date: {p.date}</p>

                        <div>
                            <button
                                onClick={() => navigate(`/product/${p._id}`)}
                                className="btn btn-outline btn-primary mt-2 w-full"
                            >
                                Details
                            </button>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    );
};

export default ProductSection;
