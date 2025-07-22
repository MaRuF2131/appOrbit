import { Suspense,lazy } from "react";
import { createBrowserRouter } from "react-router-dom";
const Mainlayout=lazy(()=>import('../layouts/Mainlayout'));
import Dashboardlayout from'../layouts/Dashboardlayout';
const Home =lazy(()=>import('../pages/Home'));
const Products =lazy(()=>import('../pages/forNonUserPage/ProductPage'));
const Login =lazy(()=>import('../pages/Login'));
const Register =lazy(()=>import('../pages/Register'));
const PrivateRoute =lazy(()=>import('../routes/PrivateRoute'));
const AddPrudctpage =lazy(()=>import('../pages/AddProductpage'));
const ElementErrorPage=lazy(()=>import('../pages/ElementErrorPage'));
const MyPrudctpage=lazy(()=>import("../pages/Myproduct"))
import ActionOnForm from'../utils/FormFunction/ActionOnForm';
import Routeerror from '../pages/Routeerror';
const UpdateProduct=lazy(()=>import("../pages/UpdateProduct"));
const Overview=lazy(()=>import("../pages/Overview"));
const Profile=lazy(()=>import("../pages/Profile"));
const MessageRoute=lazy(()=>import("./MessageRoute"));
const ManageUser=lazy(()=>import('../pages/adminPage/ManageUser'))
const ProductReviewQueue =lazy(()=>import('../pages/moderatorPage/ProductReviewQueue'))
const ProductDetails =lazy(()=>import('../pages/anyUserPage/ProductDetails'))
import AdminPrivateRoute from "./AdminPrivateRoute";
import ModeratorPrivateRoute from "./ModeratorPrivateRoute";

const ManageCoupons=lazy(()=>import("../pages/adminPage/ManageCoupon"))

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
      element: <ProductDetails/>
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
        <PrivateRoute>
          <AddPrudctpage />
        </PrivateRoute>
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
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      )
    },
    {
      path: '/dashboard/My Products',
      element: (
        <PrivateRoute>
          <MyPrudctpage />
        </PrivateRoute>
      )
    },
    {
      path: '/dashboard/products/update/:id',
      element: (
        <PrivateRoute>
          <UpdateProduct />
        </PrivateRoute>
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
           <ProductReviewQueue></ProductReviewQueue>
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