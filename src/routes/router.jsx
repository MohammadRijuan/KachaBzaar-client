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
        Component:ProductDetails
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
    element: <DashboardLayout></DashboardLayout>,
    children: [{
      index: true,
      path: 'all-users',
      Component: AllUsers
    },
    {
      path: 'pending-vendor',
      Component: PendingVendors,
    },
    {
      path: 'add-product',
      Component: AddProduct
    },
    {
      path: 'my-product',
      Component: MyProduct
    },
    {
      path: 'all-products',
      Component: AllProducts
    },
    {
      path:'add-advertisement',
      Component: AddAdvertisement
    },
    {
      path:'my-advertisement',
      Component: MyAdvertisements
    },
    {
      path:'all-adds',
      Component: AllAdvertisements
    }
    ]
  }
])