import { createBrowserRouter } from "react-router";
import Rootlayout from "../layouts/Rootlayout";

import AuthLayout from "../layouts/AuthLayout";
import Register from "../Authentication/Register";
import Login from "../Authentication/Login";
import Home from "../Home/Home";
import AllProduct from "../pages/AllProduct";
import DashboardLayout from "../layouts/DashboardLayout";
import AllUsers from "../Dashboard/Admin/Allusers";
import BeVendor from "../pages/BeVendor";
import PendingVendors from "../Dashboard/Admin/PendingVendors";
import AddProduct from "../Dashboard/Vendor/AddProduct";
import MyProduct from "../Dashboard/Vendor/MyProduct";
import AllProducts from "../Dashboard/Admin/AllProducts";
import ProductDetails from "../pages/ProductDetails";
import AddAdvertisement from "../Dashboard/Vendor/AddAdvertisement";
import MyAdvertisements from "../Dashboard/Vendor/MyAdvertisement";
import AllAdvertisements from "../Dashboard/Admin/AllAdvertisements";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import VendorRoute from "./VendorRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Rootlayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "/product/:id",
        element:<PrivateRoute><ProductDetails></ProductDetails></PrivateRoute>
      },
      {
        path:'be-vendor',
        element:<PrivateRoute><BeVendor></BeVendor></PrivateRoute>
      }


    ]
  },
  {
    path: '/',
    Component: AuthLayout,
    children: [
      {
        path: 'login',
        Component: Login
      },
      {
        path: 'register',
        Component: Register
      }
    ]

  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout></DashboardLayout></PrivateRoute>,
    children: [{
      index: true,
      path: 'all-users',
      element:<AdminRoute><AllUsers></AllUsers></AdminRoute>
    },
    {
      path: 'pending-vendor',
      element:<AdminRoute><PendingVendors></PendingVendors></AdminRoute>,
    },
    {
      path: 'add-product',
      element: <VendorRoute><AddProduct></AddProduct></VendorRoute>
    },
    {
      path: 'my-product',
      element: <VendorRoute><MyProduct></MyProduct></VendorRoute>
    },
    {
      path: 'all-products',
      element: <AdminRoute><AllProducts></AllProducts></AdminRoute>
    },
    {
      path:'add-advertisement',
      element: <AdminRoute><AddAdvertisement></AddAdvertisement></AdminRoute>
    },
    {
      path:'my-advertisement',
      element: <AdminRoute><MyAdvertisements></MyAdvertisements></AdminRoute>
    },
    {
      path:'all-adds',
      element: <AdminRoute><AllAdvertisements></AllAdvertisements></AdminRoute>
    }
    ]
  }
])