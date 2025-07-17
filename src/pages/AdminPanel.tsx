import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Users, Package, AlertCircle, TrendingUp, Eye, MessageCircle, CheckCircle } from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalComplaints: number;
  totalRevenue: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'seller' | 'buyer';
  joinDate: string;
  status: 'active' | 'inactive';
}

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'resolved';
  createdAt: string;
  userEmail: string;
  response?: string;
}

const AdminPanel: React.FC = () => {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalProducts: 0,
    totalComplaints: 0,
    totalRevenue: 0
  });
  
  const [users, setUsers] = useState<User[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'complaints'>('overview');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [response, setResponse] = useState('');

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== 'admin') {
      navigate('/');
      return;
    }

    // Load mock data
    const mockUsers: User[] = [
      { id: '1', name: 'Kumar Fisherman', email: 'kumar@seller.com', role: 'seller', joinDate: '2024-01-15', status: 'active' },
      { id: '2', name: 'Ravi Fisherman', email: 'ravi@seller.com', role: 'seller', joinDate: '2024-01-20', status: 'active' },
      { id: '3', name: 'Priya Customer', email: 'priya@buyer.com', role: 'buyer', joinDate: '2024-02-01', status: 'active' },
      { id: '4', name: 'Raj Customer', email: 'raj@buyer.com', role: 'buyer', joinDate: '2024-02-05', status: 'active' }
    ];

    const mockComplaints: Complaint[] = [
      {
        id: '1',
        title: 'Payment Issue',
        description: 'UPI payment failed but money was deducted',
        status: 'pending',
        createdAt: '2024-02-10',
        userEmail: 'priya@buyer.com'
      },
      {
        id: '2',
        title: 'Fish Quality',
        description: 'The fish delivered was not fresh',
        status: 'resolved',
        createdAt: '2024-02-08',
        userEmail: 'raj@buyer.com',
        response: 'We have contacted the seller and provided a refund. Quality standards have been reinforced.'
      }
    ];

    setUsers(mockUsers);
    setComplaints(mockComplaints);
    setStats({
      totalUsers: mockUsers.length,
      totalProducts: 15,
      totalComplaints: mockComplaints.length,
      totalRevenue: 25000
    });
  }, [user, navigate]);

  const handleResolveComplaint = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResponse('');
  };

  const submitResponse = () => {
    if (selectedComplaint && response.trim()) {
      setComplaints(prev => 
        prev.map(c => 
          c.id === selectedComplaint.id 
            ? { ...c, status: 'resolved', response: response.trim() }
            : c
        )
      );
      setSelectedComplaint(null);
      setResponse('');
    }
  };

  const statCards = [
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-green-500' },
    { title: 'Complaints', value: stats.totalComplaints, icon: AlertCircle, color: 'bg-yellow-500' },
    { title: 'Revenue', value: `₹${stats.totalRevenue}`, icon: TrendingUp, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, products, and complaints</p>
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

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'users', label: 'Users' },
                { key: 'complaints', label: 'Complaints' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Platform Overview</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">Recent Activity</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• 3 new users registered today</li>
                      <li>• 5 new products listed</li>
                      <li>• 2 complaints resolved</li>
                      <li>• ₹2,500 revenue generated</li>
                    </ul>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4">
                    <h3 className="font-medium text-green-900 mb-2">System Status</h3>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>• All systems operational</li>
                      <li>• 99.9% uptime this month</li>
                      <li>• Voice recognition working</li>
                      <li>• Payment system active</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Join Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'seller' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.joinDate}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-900 mr-3">
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'complaints' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Complaint Management</h2>
                
                <div className="space-y-4">
                  {complaints.map((complaint) => (
                    <div key={complaint.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{complaint.title}</h3>
                          <p className="text-sm text-gray-500">From: {complaint.userEmail}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            complaint.status === 'pending' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {complaint.status}
                          </span>
                          {complaint.status === 'pending' && (
                            <button
                              onClick={() => handleResolveComplaint(complaint)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <MessageCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{complaint.description}</p>
                      
                      {complaint.response && (
                        <div className="bg-blue-50 rounded-lg p-3 mt-3">
                          <p className="text-sm font-medium text-blue-900 mb-1">Admin Response:</p>
                          <p className="text-sm text-blue-800">{complaint.response}</p>
                        </div>
                      )}
                      
                      <div className="text-sm text-gray-500 mt-2">
                        Created: {complaint.createdAt}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Response Modal */}
        {selectedComplaint && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Respond to: {selectedComplaint.title}
              </h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Original complaint:</p>
                <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded">
                  {selectedComplaint.description}
                </p>
              </div>
              
              <textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Enter your response..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
              
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  onClick={() => setSelectedComplaint(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={submitResponse}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Resolve</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;