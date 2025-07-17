import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Search, Filter, ShoppingCart, Star, MapPin, Heart, Eye, Zap } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
  description: string;
  sellerId: string;
  sellerName: string;
  location: string;
  rating: number;
  reviews: number;
  discount?: number;
  isFresh: boolean;
  catchTime: string;
}

const MarketplacePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPrice, setFilterPrice] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { showNotification } = useNotification();

  useEffect(() => {
    loadProducts();
    loadFavorites();
  }, []);

  useEffect(() => {
    filterAndSortProducts();
  }, [products, searchTerm, filterPrice, sortBy]);

  const loadProducts = () => {
    setIsLoading(true);
    
    // Enhanced mock products with more details
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Fresh Prawns',
        quantity: 2,
        unit: 'kg',
        price: 450,
        image: "https://bradleysfish.com/wp-content/uploads/2021/05/Whole-Prawns-46-1KG2-Custom-1.jpg",
        description: 'Premium quality prawns caught fresh this morning from deep sea waters',
        sellerId: 'seller1',
        sellerName: 'Kumar Fisherman',
        location: 'Marina Beach, Chennai',
        rating: 4.8,
        reviews: 124,
        discount: 10,
        isFresh: true,
        catchTime: '6 hours ago'
      },
      {
        id: '2',
        name: 'Pomfret Fish',
        quantity: 1,
        unit: 'kg',
        price: 350,
        image: "https://freshsharp.com/assets/mUpload/1662452643Pomfret-Fish-Moile-Masala-.jpeg",
        description: 'Silver pomfret fish, perfect for frying and curry preparations',
        sellerId: 'seller2',
        sellerName: 'Ravi Fisherman',
        location: 'Besant Nagar, Chennai',
        rating: 4.6,
        reviews: 89,
        isFresh: true,
        catchTime: '4 hours ago'
      },
      {
        id: '3',
        name: 'Tuna Fish',
        quantity: 1.5,
        unit: 'kg',
        price: 280,
        image: "https://thumbs.dreamstime.com/z/bluefin-four-tuna-fish-thunnus-thynnus-catch-row-19398081.jpg",
        description: 'Fresh yellowfin tuna, rich in protein and omega-3 fatty acids',
        sellerId: 'seller3',
        sellerName: 'Murugan Fisherman',
        location: 'Royapuram, Chennai',
        rating: 4.7,
        reviews: 156,
        discount: 15,
        isFresh: true,
        catchTime: '8 hours ago'
      },
      {
        id: '4',
        name: 'Mackerel Fish',
        quantity: 2,
        unit: 'kg',
        price: 180,
        image: "https://tse3.mm.bing.net/th/id/OIP.1nEZrtmwxE3shqy7CiusigHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
        description: 'Fresh mackerel fish, excellent source of healthy fats',
        sellerId: 'seller4',
        sellerName: 'Selvam Fisherman',
        location: 'Kasimedu, Chennai',
        rating: 4.5,
        reviews: 67,
        isFresh: true,
        catchTime: '5 hours ago'
      },
      {
        id: '5',
        name: 'Mud Crab',
        quantity: 0.5,
        unit: 'kg',
        price: 500,
        image: "https://3.bp.blogspot.com/-S5M3wEpZsfQ/TsrVWrVYzjI/AAAAAAAAAwo/g4vWE3HevPI/s1600/mud+crab.jpg",
        description: 'Live mud crabs, perfect for special occasions and celebrations',
        sellerId: 'seller5',
        sellerName: 'Arjun Fisherman',
        location: 'Thiruvanmiyur, Chennai',
        rating: 4.9,
        reviews: 203,
        discount: 5,
        isFresh: true,
        catchTime: '2 hours ago'
      },
      {
        id: '6',
        name: 'Atlantic Salmon',
        quantity: 1,
        unit: 'kg',
        price: 600,
        image: "https://st.depositphotos.com/1194063/3151/i/950/depositphotos_31517765-stock-photo-atlantic-salmon.jpg",
        description: 'Premium imported Atlantic salmon, perfect for grilling',
        sellerId: 'seller6',
        sellerName: 'Venkat Fisherman',
        location: 'Neelankarai, Chennai',
        rating: 4.8,
        reviews: 91,
        isFresh: true,
        catchTime: '12 hours ago'
      }
    ];

    // Add voice-listed products
    const savedProducts = localStorage.getItem('sellerProducts');
    if (savedProducts) {
      const voiceProducts = JSON.parse(savedProducts).map((product: any) => ({
        ...product,
        sellerId: 'voice-seller',
        sellerName: 'Voice Seller',
        location: 'Chennai',
        rating: 4.5,
        reviews: Math.floor(Math.random() * 50) + 10,
        isFresh: true,
        catchTime: '1 hour ago'
      }));
      mockProducts.push(...voiceProducts);
    }

    setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
  };

  const loadFavorites = () => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  };

  const filterAndSortProducts = () => {
    let filtered = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesPrice = filterPrice === 'all' || 
        (filterPrice === 'low' && product.price < 300) ||
        (filterPrice === 'medium' && product.price >= 300 && product.price < 500) ||
        (filterPrice === 'high' && product.price >= 500);
      
      return matchesSearch && matchesPrice;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price;
        case 'price-high': return b.price - a.price;
        case 'rating': return b.rating - a.rating;
        case 'newest': return new Date(b.catchTime).getTime() - new Date(a.catchTime).getTime();
        default: return 0;
      }
    });

    setFilteredProducts(filtered);
  };

  const handleAddToCart = (product: Product) => {
    if (!user) {
      showNotification({
        type: 'warning',
        title: 'Please Sign In',
        message: 'You need to sign in to add items to cart'
      });
      return;
    }

    if (user.role !== 'buyer') {
      showNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'Only buyers can add items to cart'
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price,
      weight: `${product.quantity} ${product.unit}`,
      image: product.image,
      sellerId: product.sellerId
    });

    showNotification({
      type: 'success',
      title: 'Added to Cart!',
      message: `${product.name} has been added to your cart`
    });
  };

  const toggleFavorite = (productId: string) => {
    const newFavorites = favorites.includes(productId)
      ? favorites.filter(id => id !== productId)
      : [...favorites, productId];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    showNotification({
      type: 'info',
      title: favorites.includes(productId) ? 'Removed from Favorites' : 'Added to Favorites',
      message: favorites.includes(productId) ? 'Item removed from your favorites' : 'Item added to your favorites'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading fresh fish from the sea...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🐟 Fresh Fish Marketplace</h1>
          <p className="text-xl text-gray-600">Direct from local fishermen to your table</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="glass-card rounded-2xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for fish, prawns, crab..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-gray-400" />
                <select
                  value={filterPrice}
                  onChange={(e) => setFilterPrice(e.target.value)}
                  className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under ₹300</option>
                  <option value="medium">₹300 - ₹500</option>
                  <option value="high">Above ₹500</option>
                </select>
              </div>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Freshest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                    <div className="bg-current rounded-sm"></div>
                  </div>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600'}`}
                >
                  <div className="w-4 h-4 flex flex-col gap-0.5">
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                    <div className="bg-current h-0.5 rounded"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          {filteredProducts.length > 0 && (
            <div className="flex items-center space-x-2 text-green-600">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-medium">Fresh catches available!</span>
            </div>
          )}
        </div>

        {/* Products Grid/List */}
        {filteredProducts.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" 
            : "space-y-4"
          }>
            {filteredProducts.map((product, index) => (
              <div 
                key={product.id} 
                className={`fish-card bg-white rounded-2xl shadow-lg overflow-hidden ${
                  viewMode === 'list' ? 'flex items-center p-4' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`relative ${viewMode === 'list' ? 'w-32 h-32 flex-shrink-0' : ''}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`object-cover ${
                      viewMode === 'list' ? 'w-full h-full rounded-xl' : 'w-full h-48'
                    }`}
                  />
                  
                  {/* Fresh Badge */}
                  {product.isFresh && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      FRESH
                    </div>
                  )}
                  
                  {/* Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      -{product.discount}%
                    </div>
                  )}
                  
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(product.id)}
                    className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform"
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(product.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-gray-400'
                      }`} 
                    />
                  </button>
                </div>
                
                <div className={`p-6 ${viewMode === 'list' ? 'flex-1 ml-4' : ''}`}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900 capitalize">{product.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700">{product.rating}</span>
                      <span className="text-xs text-gray-500">({product.reviews})</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  
                  <div className="flex items-center space-x-1 text-sm text-gray-500 mb-3">
                    <MapPin className="h-4 w-4" />
                    <span>{product.location}</span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.quantity} {product.unit}
                      </span>
                      <span className="text-xs text-green-600 font-medium">
                        Caught {product.catchTime}
                      </span>
                    </div>
                    
                    <div className="text-right">
                      {product.discount && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{product.price}
                        </span>
                      )}
                      <div className="text-2xl font-bold text-green-600">
                        ₹{product.discount ? Math.round(product.price * (1 - product.discount / 100)) : product.price}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">
                      by {product.sellerName}
                    </span>
                    
                    <div className="flex space-x-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {user?.role === 'buyer' && (
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn-primary text-white px-4 py-2 rounded-xl hover-lift flex items-center space-x-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          <span>Add to Cart</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐟</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No fish found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterPrice('all');
                setSortBy('newest');
              }}
              className="btn-primary text-white px-6 py-3 rounded-xl"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">🌟 Why Choose FishEasy ?</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🎣</div>
              <h4 className="font-semibold text-gray-900 mb-2">Fresh from Sea</h4>
              <p className="text-gray-600 text-sm">Caught fresh daily by local fishermen</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">💰</div>
              <h4 className="font-semibold text-gray-900 mb-2">Fair Prices</h4>
              <p className="text-gray-600 text-sm">Direct pricing with no middlemen</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🚚</div>
              <h4 className="font-semibold text-gray-900 mb-2">Fast Delivery</h4>
              <p className="text-gray-600 text-sm">Fresh fish delivered to your door</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketplacePage;