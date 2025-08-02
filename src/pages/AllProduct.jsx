import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

const AllProduct = () => {
  const navigate = useNavigate();
  const [sort, setSort] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [search, setSearch] = useState("");  // New search state

  const { data: productsData, isLoading, isError, refetch } = useQuery({
    queryKey: ["approvedProducts", sort, startDate, endDate, search],
    queryFn: async () => {
      const params = {};
      if (sort) params.sort = sort;
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;
      if (search) params.search = search;  // Pass search to API

      const res = await axios.get("https://kacha-bazaar-server.vercel.app/approved-products", {
        params,
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const products = Array.isArray(productsData) ? productsData : [];

  const handleFilter = () => {
    refetch();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl text-center font-bold mb-4">Market Products</h2>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-4 items-end mb-6">
        {/* Search input */}
        <div>
          <label className="block text-sm">Search Product</label>
          <input
            type="text"
            placeholder="Search by product name"
            className="input input-bordered"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm">Sort by Price</label>
          <select
            className="select select-bordered"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Default</option>
            <option value="asc">Low → High</option>
            <option value="desc">High → Low</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Start Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm">End Date</label>
          <input
            type="date"
            className="input input-bordered"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button
          onClick={handleFilter}
          className="btn btn-primary"
        >
          Apply
        </button>
      </div>

      {/* Loading/Error */}
      {isLoading && <p className="text-center">Loading...</p>}
      {isError && <p className="text-center text-red-500">Failed to load products.</p>}
      {!isLoading && products.length === 0 && (
        <p className="text-center">No approved products found for filter.</p>
      )}

      {/* Products */}
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
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

            <button
              onClick={() => navigate(`/product/${p._id}`)}
              className="btn btn-outline btn-primary mt-2 w-full"
            >
              Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllProduct;
