import About from "../containers/about/About";
import Department from "../containers/admin/department/Department";
import Product from "../containers/admin/product/Product";
import University from "../containers/admin/university/University";
import Contact from "../containers/contact/Contact";
import Home from "../containers/user/home/Home";
import Login from "../containers/login/Login";
import Register from "../containers/register/Register";
import Support from "../containers/support/Support";
import UserDepartment from "../containers/user/department/UserDepartment";
import UserProduct from "../containers/user/product/UserProduct";
import UserProductDetail from "../containers/user/productDetail/UserProductDetail";
import { Component } from "react";
import Cart from "../containers/user/cart/Cart";
import Checkout from "../containers/user/checkout/CheckOut";
import PaymentSuccess from "../containers/user/paymentsuccess/PaymentSuccess";
import ProtectedRoute from "../components/ProtectedRoute";


const ROUTES = {
    home:{
name:"/",
component:(
  <ProtectedRoute>
<Home/>
</ProtectedRoute>
)
    },
  about: {
    name: "/about",
    component: <About />,
  },
   contact: {
    name: "/contact",
    component: <Contact />,
  },
  support: {
    name: "/support",
    component: <Support />,
  },
  register: {
    name: "/register",
    Component: <Register />,
  },
  login: {
    name: "/login",
    Component: <Login />,
  },
  universityAdmin: {
    name: "/universityAdmin",
    component: <University/>
  },
  departmentAdmin: {
    name: "/departmentAdmin",
    component: <Department />,
  },
  productAdmin: {
    name: "/productAdmin",
    component: <Product />,
  },
  departmentUser: {
    name: "/departmentUser",
    component: <UserDepartment/>
  },
  productUser: {
    name: "/productUser",
    component: <UserProduct />,
  },
  productDetail: {
    name: "/productDetail",
    component: <UserProductDetail />,
  },
   cart:{
        name:"/cart",
        component:<Cart/>,
    },
       checkout:{
        name:"/checkout",
        component:<Checkout/>
    },
  paymentSuccess: {
  name: "/payment-success",
  component: <PaymentSuccess />,
}
};

export default ROUTES;
