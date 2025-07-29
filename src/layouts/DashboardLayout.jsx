import React from 'react';
import { Link, Outlet } from 'react-router';
import {
  LayoutDashboard, ClipboardList, ShoppingCart, PlusCircle,
  Eye, Megaphone, Users, Boxes
} from 'lucide-react';
import useAuth from '../hooks/useAuth';
import Footer from '../components/Footer';
import useUserRole from '../hooks/useUserRole';

const DashboardLayout = () => {
  const { user } = useAuth();
  const { role, roleLoading } = useUserRole();

  if (roleLoading) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  return (
    <div>
      <div className="min-h-screen flex bg-gray-100">
        {/* Sidebar */}
        <aside className="w-72 bg-white shadow-md hidden lg:flex flex-col p-6 space-y-5">
          <Link to="/" className="text-2xl font-bold text-green-600 flex items-center gap-2">
            <LayoutDashboard /> KachaBazaar
          </Link>

          <nav className="flex flex-col gap-4 text-gray-700">
            {/* User Panel */}
            {(role === 'user') && (
              <>
                <span className="text-xs font-semibold text-gray-400 uppercase">User Panel</span>

                <Link to="/dashboard/my-orders" className="hover:text-green-600 flex items-center gap-2">
                  <ShoppingCart size={18} /> My Orders
                </Link>
                <Link to="/dashboard/watchlist" className="hover:text-green-600 flex items-center gap-2">
                  <Eye size={18} /> Watchlist
                </Link>
              </>
            )}

            {/* Vendor Panel */}
            {role === 'vendor' && (
              <>
                <span className="text-xs font-semibold text-gray-400 uppercase">Vendor Panel</span>

                <Link to="/dashboard/add-product" className="hover:text-green-600 flex items-center gap-2">
                  <PlusCircle size={18} /> Add Product
                </Link>
                <Link to="/dashboard/my-product" className="hover:text-green-600 flex items-center gap-2">
                  <Boxes size={18} /> My Products
                </Link>
                <Link to="/dashboard/add-advertisement" className="hover:text-green-600 flex items-center gap-2">
                  <Megaphone size={18} /> Add Advertisement
                </Link>
                <Link to="/dashboard/my-advertisement" className="hover:text-green-600 flex items-center gap-2">
                  <Megaphone size={18} /> My Advertisements
                </Link>
              </>
            )}

            {/* Admin Panel */}
            {role === 'admin' && (
              <>
                <span className="text-xs font-semibold text-gray-400 uppercase">Admin Panel</span>

                <Link to="/dashboard/all-users" className="hover:text-green-600 flex items-center gap-2">
                  <Users size={18} /> All Users
                </Link>
                <Link to="/dashboard/all-products" className="hover:text-green-600 flex items-center gap-2">
                  <ClipboardList size={18} /> All Products
                </Link>
                <Link to="/dashboard/all-adds" className="hover:text-green-600 flex items-center gap-2">
                  <Megaphone size={18} /> All Advertisements
                </Link>
                <Link to="/dashboard/all-orders" className="hover:text-green-600 flex items-center gap-2">
                  <ShoppingCart size={18} /> All Orders
                </Link>
                <Link to="/dashboard/pending-vendor" className="hover:text-green-600 flex items-center gap-2">
                  <ShoppingCart size={18} /> Pending Vendors
                </Link>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <header className="bg-white shadow px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">Dashboard</h2>
            <div className="flex items-center gap-4">
              <img
                src={user?.photoURL || '/default-avatar.png'}
                alt="User Avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
              <span className="text-sm font-medium text-gray-600">
                {user?.displayName || 'User'}
              </span>
            </div>
          </header>

          <main className="flex-1 p-6">
            <Outlet />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DashboardLayout;
