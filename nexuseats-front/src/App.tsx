import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from '@/services/graphql';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { RestaurantsPage } from '@/pages/RestaurantsPage';
import { RestaurantDetailPage } from '@/pages/RestaurantDetailPage';
import { CartPage } from '@/pages/CartPage';
import { OrdersPage } from '@/pages/OrdersPage';
import { OrderDetailPage } from '@/pages/OrderDetailPage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { HealthPage } from '@/pages/HealthPage';

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <AuthProvider>
        <CartProvider>
          <BrowserRouter>
            <Navbar />
            <main className="app-main">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/restaurants/:id" element={<RestaurantDetailPage />} />
                <Route path="/health" element={<HealthPage />} />

                {/* Routes protegees */}
                <Route
                  path="/cart"
                  element={
                    <ProtectedRoute>
                      <CartPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/orders/:id"
                  element={
                    <ProtectedRoute>
                      <OrderDetailPage />
                    </ProtectedRoute>
                  }
                />

                {/* Dashboard admin */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute roles={['admin']}>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}
