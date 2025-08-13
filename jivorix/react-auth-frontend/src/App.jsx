import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import PrivateRoute from './components/productDetail/PrivateRoute';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Enter from './pages/enter/Enter';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import CartInitializer from './components/cart/CartInitializer';
import FavoritesInitializer from './components/favorite/FavoritesInitializer';
import FavoriteList from './pages/FavoriteList';
import ProductDetail from './pages/ProductDetail';
import MenuButton from './components/navbar/MenuButton';
import Profile from './pages/Profile';
import AdminUsers from './pages/admin/AdminUsers';
import ScrollToTop from './components/ScrollToTop';
import LeftHome from './components/home/LeftHome';
import ForgotPassword from './pages/reset/ForgetPassword';
import ResetPassword from './pages/reset/ResetPassword';
import PaymentSuccess from './components/cart/payment/PaymentSuccess';
import OrderDetails from './pages/admin/orderDetail/OrderDetails';
import OrderHistory from './pages/OrderHistory';
import { motion } from "framer-motion";
import Breadcrumbs from './components/navbar/Breadcrumbs';
import LeftDrawer from './components/home/LeftDrawer'; // ✅ NEW

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthRoute = ['/login', '/signup', '/', '/forgot-password', '/reset-password'].includes(location.pathname);
  const isAdminPage = location.pathname === '/AdminUsers';

  const hideLeftHomeRoutes = ['/about', '/item/', '/cart', '/payment-success', '/order-details', '/order-history'];
  const shouldHideLeftHome = hideLeftHomeRoutes.some(route =>
    location.pathname.startsWith(route)
  );

  // Admin page separate and clean (no Navbar, no Footer, no Breadcrumbs)
  if (isAdminPage) {
    return (
      <Routes>
        <Route path="/AdminUsers" element={<AdminUsers />} />
      </Routes>
    );
  }

  return (
    <>
      {!isAuthRoute && (
        <div className='allCenter flex-col w-full'>
          {/* Top navigation */}
          <div className='fixed top-0 z-50 w-full'>
            <Navbar />
            <Breadcrumbs />
          </div>

          {/* Mobile drawer */}
          <LeftDrawer />

          {/* Main Content */}
          <main className='container mt-[150px] max-sm:mt-[190px]'>
            {shouldHideLeftHome ? (
              <Routes>
                <Route element={<PrivateRoute />}>
                  <Route path="/about" element={<About />} />
                  <Route path="/item/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/payment-success" element={<PaymentSuccess onClose={() => navigate('/shop')} />} />
                  <Route path="/order-details" element={<OrderDetails onBack={() => navigate('/cart')} />} />
                  <Route path="/order-history" element={<OrderHistory />} />
                </Route>
              </Routes>
            ) : (
              <div className='grid grid-cols-12 gap-4'>
                <div className='col-span-3 max-lg:hidden'>
                  <motion.div
                    className="sticky top-0 sc h-[100vh] overflow-scroll col-span-3 max-lg:hidden"
                    initial={location.state?.fromLogin ? { x: -100, opacity: 0 } : false}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <div>
                      <LeftHome />
                    </div>
                  </motion.div>
                </div>
                <div className='col-span-9 max-lg:col-span-full'>
                  <Routes>
                    <Route element={<PrivateRoute />}>
                      <Route path="/home" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/favorite" element={<FavoriteList />} />
                      <Route path="/profile" element={<Profile />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/home" />} />
                  </Routes>
                  <Footer />
                </div>
              </div>
            )}
          </main>

          {/* Bottom components */}
          <MenuButton />
        </div>
      )}

      {/* Public/Auth Routes */}
      {isAuthRoute && (
        <Routes>
          <Route path="/" element={<Enter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      )}
    </>
  );
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartInitializer />
      <FavoritesInitializer />
      <AppContent />
    </Router>
  );
}

export default App;
