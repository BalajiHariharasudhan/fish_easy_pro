import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mic, Package, TrendingUp, DollarSign, Users, Plus, Edit, Trash2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
  description: string;
}

const SellerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRevenue: 0,
    activeOrders: 0,
    customers: 0
  });

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'seller') {
      navigate('/');
      return;
    }

    // Load seller's products
    const savedProducts = localStorage.getItem('sellerProducts');
    if (savedProducts) {
      const sellerProducts = JSON.parse(savedProducts);
      setProducts(sellerProducts);
      
      // Calculate stats
      setStats({
        totalProducts: sellerProducts.length,
        totalRevenue: sellerProducts.reduce((sum: number, product: Product) => sum + product.price, 0),
        activeOrders: Math.floor(Math.random() * 10) + 1,
        customers: Math.floor(Math.random() * 50) + 10
      });
    }
  }, [user, navigate]);

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter(product => product.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
  };

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Revenue', value: `₹${stats.totalRevenue}`, icon: DollarSign, color: 'bg-green-500' },
    { title: 'Active Orders', value: stats.activeOrders, icon: TrendingUp, color: 'bg-yellow-500' },
    { title: 'Customers', value: stats.customers, icon: Users, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-gray-600">Manage your fish listings and track your sales</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{card.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-full`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/voice-listing"
              className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <Mic className="h-8 w-8 text-blue-600" />
              <div>
                <h3 className="font-medium text-blue-900">Voice Listing</h3>
                <p className="text-sm text-blue-700">Add fish using voice input</p>
              </div>
            </Link>
            
            <Link
              to="/marketplace"
              className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <Package className="h-8 w-8 text-green-600" />
              <div>
                <h3 className="font-medium text-green-900">View Marketplace</h3>
                <p className="text-sm text-green-700">See your products live</p>
              </div>
            </Link>
            
            <Link
              to="/complaints"
              className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
            >
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <h3 className="font-medium text-purple-900">Support</h3>
                <p className="text-sm text-purple-700">Get help & support</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Products Management */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Your Products</h2>
            <Link
              to="/voice-listing"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add New Product</span>
            </Link>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-4">Start by adding your first fish listing</p>
              <Link
                to="/voice-listing"
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mic className="h-4 w-4" />
                <span>Add Fish with Voice</span>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900 capitalize">{product.name}</h3>
                    <p className="text-gray-600">{product.description}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-sm text-gray-500">
                        {product.quantity} {product.unit}
                      </span>
                      <span className="text-lg font-bold text-green-600">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tips Section */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Better Sales</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Voice Listing Tips:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Speak clearly and slowly</li>
                <li>• Use format: "quantity unit fishname price rupees"</li>
                <li>• Example: "2 kg prawns 300 rupees"</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Increase Sales:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Add fresh fish daily</li>
                <li>• Competitive pricing</li>
                <li>• Quality photos attract buyers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;