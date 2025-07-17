import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { MessageCircle, Phone, Send, AlertCircle, CheckCircle, Headphones, Clock, User } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  response?: string;
  category: string;
}

const ComplaintPanel: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [newComplaint, setNewComplaint] = useState({ 
    title: '', 
    description: '', 
    category: 'general',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<'new' | 'history' | 'faq'>('new');

  const { user } = useAuth();
  const { showNotification } = useNotification();

  const categories = [
    { value: 'general', label: 'General Inquiry' },
    { value: 'payment', label: 'Payment Issue' },
    { value: 'delivery', label: 'Delivery Problem' },
    { value: 'quality', label: 'Product Quality' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'account', label: 'Account Issue' }
  ];

  const faqData = [
    {
      question: 'How do I use voice listing?',
      answer: 'Simply click the microphone button and speak clearly: "2 kg prawns 300 rupees". The system will automatically parse your input and create a product listing.'
    },
    {
      question: 'What payment methods are accepted?',
      answer: 'We accept UPI payments (Google Pay, PhonePe, Paytm) and Cash on Delivery (COD) for your convenience.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Fresh fish is delivered within 2-4 hours of order placement to ensure maximum freshness.'
    },
    {
      question: 'How can I track my order?',
      answer: 'You can track your order status in the "My Orders" section of your account. You\'ll receive updates via SMS as well.'
    },
    {
      question: 'What if the fish is not fresh?',
      answer: 'We guarantee fresh fish. If you\'re not satisfied with the quality, contact us immediately for a full refund or replacement.'
    }
  ];

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const complaint: Complaint = {
        id: Date.now().toString(),
        title: newComplaint.title,
        description: newComplaint.description,
        category: newComplaint.category,
        priority: newComplaint.priority,
        status: 'pending',
        createdAt: new Date().toISOString(),
      };

      setComplaints(prev => [complaint, ...prev]);
      setNewComplaint({ title: '', description: '', category: 'general', priority: 'medium' });
      
      showNotification({
        type: 'success',
        title: 'Complaint Submitted Successfully!',
        message: 'Our support team will respond within 24 hours.'
      });
      
      setActiveTab('history');
    } catch (error) {
      showNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Please try again or contact support directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCallSupport = () => {
    showNotification({
      type: 'info',
      title: 'Calling Support',
      message: 'Connecting you to our support team...'
    });
    // In a real app, this would initiate a phone call
    window.location.href = 'tel:+919876543210';
  };

  const handleLiveChat = () => {
    showNotification({
      type: 'info',
      title: 'Live Chat',
      message: 'Starting live chat session...'
    });
    // In a real app, this would open a chat widget
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center glass-card p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Sign In</h2>
          <p className="text-gray-600">You need to be logged in to access support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">🎧 Support Center</h1>
          <p className="text-xl text-gray-600">We're here to help with any issues or questions</p>
        </div>

        {/* Quick Contact Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-2xl p-6 text-center hover-lift">
            <Phone className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Call Support</h3>
            <p className="text-gray-600 mb-4">Immediate assistance available</p>
            <button
              onClick={handleCallSupport}
              className="btn-primary text-white px-6 py-3 rounded-xl w-full"
            >
              Call Now
            </button>
          </div>
          
          <div className="glass-card rounded-2xl p-6 text-center hover-lift">
            <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 mb-4">Chat with our support team</p>
            <button
              onClick={handleLiveChat}
              className="btn-secondary text-white px-6 py-3 rounded-xl w-full"
            >
              Start Chat
            </button>
          </div>
          
          <div className="glass-card rounded-2xl p-6 text-center hover-lift">
            <Send className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Submit Ticket</h3>
            <p className="text-gray-600 mb-4">Written support request</p>
            <button
              onClick={() => setActiveTab('new')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl w-full transition-colors"
            >
              Create Ticket
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="glass-card rounded-2xl overflow-hidden">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'new', label: 'New Complaint', icon: Send },
                { key: 'history', label: 'My Tickets', icon: Clock },
                { key: 'faq', label: 'FAQ', icon: AlertCircle }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'new' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">📝 Submit New Complaint</h2>
                
                <form onSubmit={handleSubmitComplaint} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        id="category"
                        value={newComplaint.category}
                        onChange={(e) => setNewComplaint(prev => ({ ...prev, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        id="priority"
                        value={newComplaint.priority}
                        onChange={(e) => setNewComplaint(prev => ({ ...prev, priority: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                      Issue Title
                    </label>
                    <input
                      type="text"
                      id="title"
                      value={newComplaint.title}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Brief description of the issue"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                      Detailed Description
                    </label>
                    <textarea
                      id="description"
                      value={newComplaint.description}
                      onChange={(e) => setNewComplaint(prev => ({ ...prev, description: e.target.value }))}
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Please provide detailed information about your issue..."
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary text-white py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center space-x-2 text-lg font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="loading-spinner"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5" />
                        <span>Submit Complaint</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">🎫 My Support Tickets</h2>
                
                {complaints.length === 0 ? (
                  <div className="text-center py-12">
                    <MessageCircle className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                    <p className="text-gray-600 mb-6">Your support tickets will appear here</p>
                    <button
                      onClick={() => setActiveTab('new')}
                      className="btn-primary text-white px-6 py-3 rounded-xl"
                    >
                      Create First Ticket
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {complaints.map((complaint) => (
                      <div key={complaint.id} className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">{complaint.title}</h3>
                            <div className="flex items-center space-x-3 mb-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                                {complaint.status.replace('_', ' ').toUpperCase()}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                                {complaint.priority.toUpperCase()} PRIORITY
                              </span>
                              <span className="text-xs text-gray-500">
                                {categories.find(c => c.value === complaint.category)?.label}
                              </span>
                            </div>
                          </div>
                          <div className="text-right text-sm text-gray-500">
                            <p>Ticket #{complaint.id.slice(-6)}</p>
                            <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 mb-4">{complaint.description}</p>
                        
                        {complaint.response && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <User className="h-4 w-4 text-blue-600" />
                              <p className="text-sm font-medium text-blue-900">Support Response:</p>
                            </div>
                            <p className="text-sm text-blue-800">{complaint.response}</p>
                          </div>
                        )}
                        
                        {complaint.status === 'pending' && (
                          <div className="flex items-center space-x-2 text-sm text-orange-600 mt-4">
                            <Clock className="h-4 w-4" />
                            <span>Response expected within 24 hours</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'faq' && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">❓ Frequently Asked Questions</h2>
                
                <div className="space-y-4">
                  {faqData.map((faq, index) => (
                    <div key={index} className="border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Still need help?</h3>
                  <p className="text-gray-600 mb-4">Can't find what you're looking for? Our support team is here to help!</p>
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() => setActiveTab('new')}
                      className="btn-primary text-white px-6 py-3 rounded-xl"
                    >
                      Submit Ticket
                    </button>
                    <button
                      onClick={handleCallSupport}
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Call Support
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintPanel;