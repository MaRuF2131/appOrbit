import { Suspense,lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Mainlayout=lazy(()=>import('../layouts/Mainlayout'));
import Dashboardlayout from'../layouts/Dashboardlayout';
const Home =lazy(()=>import('../pages/Home'));
const Products =lazy(()=>import('../pages/forNonUserPage/ProductPage'));
const Login =lazy(()=>import('../pages/Login'));
const Register =lazy(()=>import('../pages/Register'));
const AddPrudctpage =lazy(()=>import('../pages/normalUser/AddProductpage'));
const ElementErrorPage=lazy(()=>import('../pages/ElementErrorPage'));
const MyPrudctpage=lazy(()=>import("../pages/normalUser/Myproduct"))
const UpdateProduct=lazy(()=>import("../pages/normalUser/UpdateProduct"));
const Overview=lazy(()=>import("../pages/Overview"));
const Profile=lazy(()=>import("../pages/normalUser/Profile"));
const MessageRoute=lazy(()=>import("./MessageRoute"));
const ManageUser=lazy(()=>import('../pages/adminPage/ManageUser'))
const ProductReviewQueue =lazy(()=>import('../pages/moderatorPage/ProductReviewQueue'))
const ReportedContents=lazy(()=>import("../pages/moderatorPage/ReportedContents"))
const ProductDetails =lazy(()=>import('../pages/anyUserPage/ProductDetails'))
const ManageCoupons=lazy(()=>import("../pages/adminPage/ManageCoupon"))
import AdminPrivateRoute from "./AdminPrivateRoute";
import ModeratorPrivateRoute from "./ModeratorPrivateRoute";
import NormalUserPrivateRoute from "./NormalUserPrivateRoute";
import PrivateRoute from'../routes/PrivateRoute';
import ActionOnForm from'../utils/FormFunction/ActionOnForm';
import Routeerror from '../pages/Routeerror';

export const Routers=createBrowserRouter([
   {
  path: '/',
  errorElement: <ElementErrorPage />,
  element: <Mainlayout />,
  children: [
    // main layout path
    {
      path: '/',
      element: <Home />
    },
    {
      path: '/products',
      element: <Products/>
    },
    {
      path: '/product/:id',
      element:(
         <PrivateRoute>
           <ProductDetails/>
         </PrivateRoute>
        )
    },
    {
      path: '/login',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    },
    {
      path: "/save",
      element: <></>,
      action: ActionOnForm,
      loader: () => {
        throw new Response("Not Found", { 
          status: 404,
          statusText: "This route is not directly accessible.",
        });
      }
    }
  ]
},
{
  path: '/dashboard',
  element: (
    <PrivateRoute>
      <Dashboardlayout />
    </PrivateRoute>
  ),
  errorElement: <ElementErrorPage />,
  children: [

    //user path
    {
      path: '/dashboard/Add Products',
      element: (
        <NormalUserPrivateRoute>
          <AddPrudctpage />
        </NormalUserPrivateRoute>
      )
    },
    {
      path: '/dashboard',
      element: (
        <PrivateRoute>
          <Overview />
        </PrivateRoute>
      )
    },
    {
      path: '/dashboard/My Profile',
      element: (
        <NormalUserPrivateRoute>
          <Profile />
        </NormalUserPrivateRoute>
      )
    },
    {
      path: '/dashboard/My Products',
      element: (
        <NormalUserPrivateRoute>
          <MyPrudctpage />
        </NormalUserPrivateRoute>
      )
    },
    {
      path: '/dashboard/products/update/:id',
      element: (
        <NormalUserPrivateRoute>
          <UpdateProduct />
        </NormalUserPrivateRoute>
      )
    },


    ///admin path
    {
      path: '/dashboard/Manage Users',
      element: (
        <AdminPrivateRoute>
          <ManageUser />
        </AdminPrivateRoute>
      )
    },
    {
      path: '/dashboard/Manage Coupons',
      element: (
        <AdminPrivateRoute>
          <ManageCoupons />
        </AdminPrivateRoute>
      )
    },

    // morderator path
    {
      path:'/dashboard/Product Review',
      element:(
        <ModeratorPrivateRoute>
           <ProductReviewQueue></ProductReviewQueue>
        </ModeratorPrivateRoute>
      )
    },
    {
      path:'/dashboard/Reported Contents',
      element:(
        <ModeratorPrivateRoute>
           <ReportedContents></ReportedContents>
        </ModeratorPrivateRoute>
      )
    }
  ]
},
{
  path: '/message',
  element: <MessageRoute />
},
{
  path: '*',
  element: <Routeerror />
}

])