import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/users/homePage";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import LoginPage from "./pages/users/crud/loginPage";
import RegisterPage from "./pages/users/crud/registerPage";
import ProfilePageUser from "./pages/users/crud/profilePageUser";
import ProductPage from "./pages/users/productsPage";
import NewsPage from "./pages/users/newsPage";
import PaymentPage from "./pages/users/instructionsPage/paymentPage";
import ContactPage from "./pages/users/contactPage";
import ProfilePage from "./pages/users/profilePage";
import ShoppingCart from "./pages/users/shoppingCartPage";
import ProductDetails from "./pages/users/productDetails/index.jsx";
import AdminLayout from "./pages/admin/theme/AdminLayout.jsx";
import UserManagementPage from "./pages/admin/UserManagementPage";
import ProductManagementPage from "./pages/admin/ProductManagementPage";
import AdminOrdersPage from "./pages/admin/AdminOrder"
import SearchResults from "./pages/users/productsPage/searchResults.jsx"
import Checkout from "./pages/users/checkout";
import { AdminNotificationProvider } from "./pages/admin/AdminNotificationContext.jsx";
import MyOrders from "./pages/users/MyOrder"

const routesWithMasterLayout = [
  {
    path: ROUTERS.USER.HOME,
    component: <HomePage />,
  },
  {
    path: ROUTERS.USER.PROFILE,
    component: <ProfilePage />,
  },
  {
    path: ROUTERS.USER.PROFILEUSER,
    component: <ProfilePageUser />,
  },
  {
    path: ROUTERS.USER.PRODUCTS,
    component: <ProductPage />,
  },
  {
    path: `${ROUTERS.USER.PRODUCTS}/:category`,
    component: <ProductPage />,
  },
  {
    path: `${ROUTERS.USER.PRODUCTS}/:category/:brand`,
    component: <ProductPage />,
  },
  {
    path: `${ROUTERS.USER.PRODUCTS}/product-details/:id`,
    component: <ProductDetails />,
  },
  {
    path: ROUTERS.USER.NEWS,
    component: <NewsPage />,
  },
  {
    path: ROUTERS.USER.PAYMENT,
    component: <PaymentPage />,
  },
  {
    path: ROUTERS.USER.CONTACT,
    component: <ContactPage />,
  },
  {
    path: ROUTERS.USER.SHOPPINGCART,
    component: <ShoppingCart />,
  },
  {
    path: ROUTERS.USER.SEARCH,
    component: <SearchResults />,
  },
  {
    path: "checkout",
    component: <Checkout />,
  },
  {
    path: ROUTERS.USER.MY_ORDERS,
    component: <MyOrders />,
  }
];

const RouterCustom = () => {
  return (
    <Routes>
      {/* ===== ADMIN ===== */}
      <Route
        path="/admin"
        element={
          <AdminNotificationProvider>
            <AdminLayout />
          </AdminNotificationProvider>
        }
      >
        <Route path="users" element={<UserManagementPage />} />
        <Route path="products" element={<ProductManagementPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
        {/* optional */}
        {/* <Route path="notifications" element={<AdminNotificationsPage />} /> */}
      </Route>

      {/* ===== USER ===== */}
      <Route path="/" element={<MasterLayout />}>
        {routesWithMasterLayout.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Route>

      <Route path={ROUTERS.USER.LOGIN} element={<LoginPage />} />
      <Route path={ROUTERS.USER.REGISTER} element={<RegisterPage />} />
    </Routes>
  );
};


export default RouterCustom;
