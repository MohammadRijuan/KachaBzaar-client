import { useQuery } from "@tanstack/react-query";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MyProduct = () => {
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["myProducts", user.email],
    queryFn: async () => {
      const res = await axiosSecure.get(`/products/vendor/${user.email}`);
      return res.data;
    },
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>
      {isLoading ? <p>Loading...</p> : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {products.map((p) => ( 
            <div key={p._id} className="card bg-base-100 shadow-md p-4">
              <img src={p.image} alt={p.itemName} className="w-full h-48 object-cover rounded" />
              <h3 className="text-xl font-bold">{p.itemName}</h3>
              <p>Price: ৳{p.pricePerUnit}</p>
              <p>Status: <span className="badge">{p.status}</span></p>
              <p className="text-sm text-gray-500">{p.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProduct;
