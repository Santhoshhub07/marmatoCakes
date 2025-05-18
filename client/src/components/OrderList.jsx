import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { orderService } from '../services/api';
import OrderCard from './OrderCard';

export default function OrderList({ categoryFilter = null }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      // Error is already handled by the API service
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOrderDelete = (deletedOrderId) => {
    setOrders(orders.filter(order => order._id !== deletedOrderId));
    toast.success('Order deleted successfully!');
  };

  // Filter orders based on category and search term
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Apply category filter if provided
      const categoryMatch = !categoryFilter || order.category === categoryFilter;

      // Apply search filter if provided
      const searchMatch = !searchTerm ||
        order.food.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.address?.toLowerCase().includes(searchTerm.toLowerCase());

      return categoryMatch && searchMatch;
    });
  }, [orders, categoryFilter, searchTerm]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border-4 border-pink-200"></div>
          <div className="w-16 h-16 rounded-full border-t-4 border-pink-600 animate-spin absolute top-0 left-0"></div>
          <div className="absolute top-0 left-0 w-16 h-16 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-600 opacity-60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
          </div>
        </div>
        <div className="ml-4 text-lg font-medium text-pink-600">Loading cakes...</div>
      </div>
    );
  }

  // Error handling is now done via toast notifications

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-pink-100">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-pink-100 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No orders found</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">Looks like you haven't placed any cake orders yet. Start by ordering your favorite cake!</p>
        <Link to="/new-order" className="inline-flex items-center bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium px-6 py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-md transform hover:-translate-y-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Place Your First Order
        </Link>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-pink-100">
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="absolute inset-0 bg-purple-100 rounded-full"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-3">No matching orders</h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">We couldn't find any cakes matching your search criteria. Try adjusting your filters or search terms.</p>
        <button
          onClick={() => setSearchTerm('')}
          className="inline-flex items-center bg-purple-100 text-purple-700 font-medium px-5 py-2 rounded-lg hover:bg-purple-200 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset Search
        </button>
      </div>
    );
  }

  return (
    <>
      {/* Search bar */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by cake type, name or city..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500 bg-gray-50 hover:bg-white focus:bg-white transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <Link
              to="/new-order"
              className="inline-flex items-center justify-center bg-gradient-to-r from-pink-500 to-pink-600 text-white font-medium px-5 py-3 rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all shadow-md whitespace-nowrap"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              New Order
            </Link>
          </div>
        </div>
      </div>

      {/* Order count */}
      <div className="mb-6 flex items-center justify-between">
        <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-100 text-gray-700 font-medium">
          <span className="text-pink-600 font-bold mr-1">{filteredOrders.length}</span>
          {filteredOrders.length === 1 ? 'cake' : 'cakes'} found
        </div>

        {searchTerm && (
          <div className="text-gray-600 flex items-center">
            <span className="mr-2">Searching for: <span className="font-medium text-gray-800">"{searchTerm}"</span></span>
            <button
              onClick={() => setSearchTerm('')}
              className="text-pink-600 hover:text-pink-700 font-medium text-sm"
            >
              Clear
            </button>
          </div>
        )}
      </div>

      {/* Order grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrders.map(order => (
          <OrderCard
            key={order._id}
            order={order}
            onDelete={handleOrderDelete}
          />
        ))}
      </div>
    </>
  );
}
