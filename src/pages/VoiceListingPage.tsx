import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Mic, MicOff, Plus, Save, AlertCircle, CheckCircle, Volume2, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  image: string;
  description: string;
}

const VoiceListingPage: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Partial<Product>>({});
  const [isSupported, setIsSupported] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [confidence, setConfidence] = useState(0);

  const { user } = useAuth();
  const { showNotification } = useNotification();
  const navigate = useNavigate();

  // Real fish images from Pexels
  const fishImages = {
    'prawn': 'https://images.pexels.com/photos/7194403/pexels-photo-7194403.jpeg?auto=compress&cs=tinysrgb&w=600',
    'prawns': 'https://images.pexels.com/photos/7194403/pexels-photo-7194403.jpeg?auto=compress&cs=tinysrgb&w=600',
    'shrimp': 'https://images.pexels.com/photos/7194403/pexels-photo-7194403.jpeg?auto=compress&cs=tinysrgb&w=600',
    'fish': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'salmon': 'https://images.pexels.com/photos/3296736/pexels-photo-3296736.jpeg?auto=compress&cs=tinysrgb&w=600',
    'tuna': 'https://images.pexels.com/photos/7194590/pexels-photo-7194590.jpeg?auto=compress&cs=tinysrgb&w=600',
    'pomfret': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'mackerel': 'https://images.pexels.com/photos/18936072/pexels-photo-18936072.jpeg?auto=compress&cs=tinysrgb&w=600',
    'sardine': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'sardines': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'crab': 'https://images.pexels.com/photos/7194576/pexels-photo-7194576.jpeg?auto=compress&cs=tinysrgb&w=600',
    'lobster': 'https://images.pexels.com/photos/7194576/pexels-photo-7194576.jpeg?auto=compress&cs=tinysrgb&w=600',
    'kingfish': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'snapper': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'cod': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600',
    'default': 'https://images.pexels.com/photos/128373/pexels-photo-128373.jpeg?auto=compress&cs=tinysrgb&w=600'
  };

  useEffect(() => {
    if (user?.role !== 'seller') {
      navigate('/');
      return;
    }

    // Load existing products
    const savedProducts = localStorage.getItem('sellerProducts');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }

    // Initialize Speech Recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Indian English for better recognition
      recognition.maxAlternatives = 3;

      recognition.onstart = () => {
        setIsListening(true);
        showNotification({
          type: 'info',
          title: 'Voice Recognition Started',
          message: 'Speak clearly: "2 kg prawns 300 rupees"'
        });
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          const confidence = event.results[i][0].confidence;
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
            setConfidence(confidence);
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          setIsProcessing(true);
          setTimeout(() => {
            parseVoiceInput(finalTranscript);
            setIsProcessing(false);
          }, 1000);
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
        showNotification({
          type: 'error',
          title: 'Voice Recognition Error',
          message: 'Please try again or check your microphone permissions.'
        });
      };

      setRecognition(recognition);
    } else {
      setIsSupported(false);
      showNotification({
        type: 'error',
        title: 'Not Supported',
        message: 'Voice recognition is not supported in this browser.'
      });
    }
  }, [user, navigate, showNotification]);

  const parseVoiceInput = (input: string) => {
    // Enhanced parsing with multiple patterns
    const patterns = [
      /(\d+(?:\.\d+)?)\s*(kg|kilogram|kilo|grams?|g)\s*(.+?)\s*(?:at|for|price|cost)?\s*(\d+)\s*(?:rupees?|rs|₹)/i,
      /(\d+(?:\.\d+)?)\s*(.+?)\s*(\d+)\s*(?:rupees?|rs|₹)/i,
      /(.+?)\s*(\d+(?:\.\d+)?)\s*(kg|kilogram|kilo|grams?|g)\s*(\d+)\s*(?:rupees?|rs|₹)/i
    ];

    let match = null;
    let patternUsed = 0;

    for (let i = 0; i < patterns.length; i++) {
      match = input.match(patterns[i]);
      if (match) {
        patternUsed = i;
        break;
      }
    }

    if (match) {
      let quantity, unit, fishName, price;

      if (patternUsed === 0) {
        quantity = parseFloat(match[1]);
        unit = match[2].toLowerCase().includes('g') && !match[2].toLowerCase().includes('kg') ? 'g' : 'kg';
        fishName = match[3].trim().toLowerCase();
        price = parseInt(match[4]);
      } else if (patternUsed === 1) {
        quantity = parseFloat(match[1]);
        fishName = match[2].trim().toLowerCase();
        price = parseInt(match[3]);
        unit = 'kg'; // default
      } else {
        fishName = match[1].trim().toLowerCase();
        quantity = parseFloat(match[2]);
        unit = match[3].toLowerCase().includes('g') && !match[3].toLowerCase().includes('kg') ? 'g' : 'kg';
        price = parseInt(match[4]);
      }

      // Clean fish name
      fishName = fishName.replace(/\b(fresh|good|quality|nice|best)\b/gi, '').trim();

      const product: Product = {
        id: Date.now().toString(),
        name: fishName,
        quantity,
        unit,
        price,
        image: fishImages[fishName as keyof typeof fishImages] || fishImages.default,
        description: `Fresh ${fishName} caught today - Premium quality`
      };

      setCurrentProduct(product);
      showNotification({
        type: 'success',
        title: 'Voice Parsed Successfully!',
        message: `${quantity} ${unit} ${fishName} for ₹${price} (Confidence: ${Math.round(confidence * 100)}%)`
      });
    } else {
      showNotification({
        type: 'warning',
        title: 'Could not parse input',
        message: 'Please try: "2 kg prawns 300 rupees" or "1 kilogram fish 250 rupees"'
      });
    }
  };

  const startListening = () => {
    if (recognition && isSupported && !isListening) {
      setTranscript('');
      setCurrentProduct({});
      setConfidence(0);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const addProduct = () => {
    if (currentProduct.name && currentProduct.quantity && currentProduct.price) {
      const newProducts = [...products, currentProduct as Product];
      setProducts(newProducts);
      localStorage.setItem('sellerProducts', JSON.stringify(newProducts));
      
      setCurrentProduct({});
      setTranscript('');
      
      showNotification({
        type: 'success',
        title: 'Product Added!',
        message: `${currentProduct.name} has been added to your inventory`
      });
    } else {
      showNotification({
        type: 'error',
        title: 'Incomplete Product',
        message: 'Please complete all product details first.'
      });
    }
  };

  const removeProduct = (id: string) => {
    const updatedProducts = products.filter(p => p.id !== id);
    setProducts(updatedProducts);
    localStorage.setItem('sellerProducts', JSON.stringify(updatedProducts));
    
    showNotification({
      type: 'info',
      title: 'Product Removed',
      message: 'Product has been removed from inventory'
    });
  };

  const saveAllProducts = () => {
    if (products.length > 0) {
      localStorage.setItem('sellerProducts', JSON.stringify(products));
      showNotification({
        type: 'success',
        title: 'Products Saved!',
        message: `${products.length} products saved successfully`
      });
      setTimeout(() => navigate('/seller-dashboard'), 2000);
    } else {
      showNotification({
        type: 'warning',
        title: 'No Products',
        message: 'Add some products first before saving.'
      });
    }
  };

  const speakInstructions = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(
        'To add fish, click the microphone and say: quantity, unit, fish name, and price. For example: 2 kg prawns 300 rupees'
      );
      utterance.lang = 'en-IN';
      speechSynthesis.speak(utterance);
    }
  };

  if (!isSupported) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl max-w-md">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Voice Recognition Not Supported</h2>
          <p className="text-gray-600 mb-6">Please use Chrome, Edge, or Safari for voice features.</p>
          <button
            onClick={() => navigate('/seller-dashboard')}
            className="btn-primary text-white px-6 py-3 rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎤 Voice Fish Listing</h1>
          <p className="text-xl text-gray-600 mb-4">
            Speak to add fish to your inventory
          </p>
          <button
            onClick={speakInstructions}
            className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <Volume2 className="h-5 w-5" />
            <span>Listen to Instructions</span>
          </button>
        </div>

        {/* Voice Input Section */}
        <div className="glass-card rounded-2xl p-8 mb-8 text-center">
          <div className="mb-8">
            <button
              onClick={isListening ? stopListening : startListening}
              disabled={isProcessing}
              className={`relative inline-flex items-center justify-center w-32 h-32 rounded-full text-white font-bold text-xl transition-all duration-300 ${
                isProcessing 
                  ? 'voice-processing cursor-not-allowed' 
                  : isListening 
                    ? 'voice-listening voice-animation' 
                    : 'btn-primary hover-scale'
              }`}
            >
              {isProcessing ? (
                <RefreshCw className="h-10 w-10 animate-spin" />
              ) : isListening ? (
                <MicOff className="h-10 w-10" />
              ) : (
                <Mic className="h-10 w-10" />
              )}
            </button>
            
            <div className="mt-6">
              <p className="text-lg font-medium text-gray-800 mb-2">
                {isProcessing 
                  ? 'Processing your voice...' 
                  : isListening 
                    ? '🎙️ Listening... Speak now!' 
                    : '🎯 Click to start voice input'
                }
              </p>
              {confidence > 0 && (
                <p className="text-sm text-gray-600">
                  Recognition Confidence: {Math.round(confidence * 100)}%
                </p>
              )}
            </div>
          </div>

          {transcript && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <p className="text-gray-800">
                <strong>You said:</strong> "{transcript}"
              </p>
            </div>
          )}

          {/* Example Commands */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Example Commands:</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <code className="text-blue-600">"2 kg prawns 300 rupees"</code>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <code className="text-blue-600">"1 kilogram fish 250 rupees"</code>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <code className="text-blue-600">"500 grams crab 400 rupees"</code>
              </div>
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <code className="text-blue-600">"3 kg salmon at 500 rupees"</code>
              </div>
            </div>
          </div>
        </div>

        {/* Current Product Preview */}
        {currentProduct.name && (
          <div className="glass-card rounded-2xl p-6 mb-8 animate-in">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">✨ Parsed Product</h2>
            <div className="flex items-center space-x-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6">
              <img
                src={currentProduct.image}
                alt={currentProduct.name}
                className="w-24 h-24 object-cover rounded-xl shadow-md"
              />
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 capitalize mb-2">{currentProduct.name}</h3>
                <p className="text-gray-600 mb-2">{currentProduct.description}</p>
                <div className="flex items-center space-x-4">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {currentProduct.quantity} {currentProduct.unit}
                  </span>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-lg font-bold">
                    ₹{currentProduct.price}
                  </span>
                </div>
              </div>
              <button
                onClick={addProduct}
                className="btn-primary text-white px-6 py-3 rounded-xl hover-lift flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add to Stock</span>
              </button>
            </div>
          </div>
        )}

        {/* Products Inventory */}
        {products.length > 0 && (
          <div className="glass-card rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                📦 Your Inventory ({products.length} items)
              </h2>
              <button
                onClick={saveAllProducts}
                className="btn-secondary text-white px-6 py-3 rounded-xl hover-lift flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>Save All Products</span>
              </button>
            </div>
            
            <div className="grid gap-4">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="flex items-center space-x-4 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg shadow-sm"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 capitalize">{product.name}</h3>
                    <p className="text-gray-600 text-sm">{product.description}</p>
                    <div className="flex items-center space-x-3 mt-2">
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {product.quantity} {product.unit}
                      </span>
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-bold">
                        ₹{product.price}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <XCircle className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Pro Tips for Voice Input</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🎯 For Best Results:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Speak clearly and at normal pace</li>
                <li>• Use format: "quantity unit fishname price rupees"</li>
                <li>• Ensure quiet environment</li>
                <li>• Allow microphone permissions</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">🐟 Supported Fish Types:</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Prawns, Shrimp, Crab, Lobster</li>
                <li>• Salmon, Tuna, Pomfret, Mackerel</li>
                <li>• Sardines, Kingfish, Snapper, Cod</li>
                <li>• And many more...</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoiceListingPage;