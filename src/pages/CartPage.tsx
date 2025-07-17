import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Minus, Plus, Trash2, CreditCard, Smartphone, CheckCircle, MapPin, Clock, Shield } from 'lucide-react';

const CartPage: React.FC = () => {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: '',
    landmark: '',
    pincode: ''
  });

  const deliveryFee = 50;
  const freeDeliveryThreshold = 500;
  const finalDeliveryFee = total >= freeDeliveryThreshold ? 0 : deliveryFee;
  const finalTotal = total + finalDeliveryFee;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity);
    showNotification({
      type: 'info',
      title: 'Cart Updated',
      message: 'Item quantity has been updated'
    });
  };

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    showNotification({
      type: 'success',
      title: 'Item Removed',
      message: 'Item has been removed from your cart'
    });
  };

  const handlePlaceOrder = async () => {
    if (!deliveryAddress.address || !deliveryAddress.phone) {
      showNotification({
        type: 'error',
        title: 'Incomplete Address',
        message: 'Please fill in all required delivery details'
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate order processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Save order to localStorage (in real app, this would go to backend)
    const order = {
      id: Date.now().toString(),
      items,
      total: finalTotal,
      paymentMethod,
      deliveryAddress,
      status: 'confirmed',
      estimatedDelivery: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
      createdAt: new Date().toISOString()
    };
    
    const existingOrders = JSON.parse(localStorage.getItem('userOrders') || '[]');
    localStorage.setItem('userOrders', JSON.stringify([order, ...existingOrders]));
    
    setIsProcessing(false);
    setOrderPlaced(true);
    clearCart();
    
    showNotification({
      type: 'success',
      title: 'Order Placed Successfully!',
      message: `Your order will be delivered in 2-4 hours via ${paymentMethod.toUpperCase()}`
    });
  };

  if (!user || user.role !== 'buyer') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">Only buyers can access the shopping cart.</p>
        </div>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center glass-card p-12 rounded-2xl max-w-md">
          <div className="relative mb-6">
            <CheckCircle className="mx-auto h-20 w-20 text-green-500" />
            <div className="absolute inset-0 animate-ping">
              <CheckCircle className="mx-auto h-20 w-20 text-green-300 opacity-75" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Order Placed Successfully! 🎉</h2>
          <p className="text-gray-600 mb-6">Your fresh fish will be delivered within 2-4 hours.</p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Estimated delivery: 2-4 hours</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Payment: {paymentMethod.toUpperCase()}</span>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => setOrderPlaced(false)}
              className="w-full btn-primary text-white py-3 rounded-xl"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => window.location.href = '/orders'}
              className="w-full border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">🛒 Your Cart</h1>
            <div className="glass-card rounded-2xl p-16">
              <div className="text-8xl mb-6">🐟</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8">Add some fresh fish to get started!</p>
              <a
                href="/marketplace"
                className="inline-block btn-primary text-white px-8 py-4 rounded-xl text-lg hover-lift"
              >
                Browse Fresh Fish
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">🛒 Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Cart Items ({items.length})</h2>
              
              <div className="space-y-4">
                {items.map((item, index) => (
                  <div 
                    key={item.id} 
                    className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-xl shadow-sm"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <p className="text-gray-600 text-sm">{item.weight}</p>
                      <p className="text-xl font-bold text-green-600">₹{item.price}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address */}
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">📍 Delivery Address</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={deliveryAddress.name}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={deliveryAddress.phone}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  placeholder="Complete Address"
                  value={deliveryAddress.address}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, address: e.target.value }))}
                  className="md:col-span-2 w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Landmark (Optional)"
                  value={deliveryAddress.landmark}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, landmark: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Pincode"
                  value={deliveryAddress.pincode}
                  onChange={(e) => setDeliveryAddress(prev => ({ ...prev, pincode: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="glass-card rounded-2xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">💰 Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">₹{total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee:</span>
                  <span className={`font-semibold ${finalDeliveryFee === 0 ? 'text-green-600' : ''}`}>
                    {finalDeliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {total < freeDeliveryThreshold && (
                  <div className="text-sm text-blue-600 bg-blue-50 p-2 rounded-lg">
                    Add ₹{freeDeliveryThreshold - total} more for free delivery!
                  </div>
                )}
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold text-gray-900">Total:</span>
                    <span className="text-lg font-bold text-green-600">₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">💳 Payment Method</h3>
                <div className="space-y-3">
                  <label className={`payment-card flex items-center space-x-3 p-4 rounded-xl cursor-pointer ${paymentMethod === 'upi' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="upi"
                      checked={paymentMethod === 'upi'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                      className="text-blue-600"
                    />
                    <Smartphone className="h-6 w-6 text-blue-600" />
                    <div>
                      <span className="font-medium">UPI Payment</span>
                      <p className="text-sm text-gray-500">Pay via Google Pay, PhonePe, Paytm</p>
                    </div>
                  </label>
                  <label className={`payment-card flex items-center space-x-3 p-4 rounded-xl cursor-pointer ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod')}
                      className="text-blue-600"
                    />
                    <CreditCard className="h-6 w-6 text-green-600" />
                    <div>
                      <span className="font-medium">Cash on Delivery</span>
                      <p className="text-sm text-gray-500">Pay when you receive</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full btn-primary text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                {isProcessing ? (
                  <>
                    <div className="loading-spinner"></div>
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Place Order - ₹{finalTotal}</span>
                  </>
                )}
              </button>
            </div>

            {/* Delivery Info */}
            <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span>🚚 Delivery Information</span>
              </h3>
              <ul className="text-sm text-gray-700 space-y-2">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Delivery within 2-4 hours</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Fresh fish guarantee</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Free delivery on orders above ₹500</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>Contact seller for any queries</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;