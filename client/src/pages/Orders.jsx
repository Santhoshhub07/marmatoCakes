import { useState } from 'react';
import { Link } from 'react-router-dom';
import OrderList from '../components/OrderList';

export default function Orders() {
  const [activeFilter, setActiveFilter] = useState('all');

  // Filter options
  const filterOptions = [
    { id: 'all', label: 'All Cakes' },
    { id: 'Birthday Cakes', label: 'Birthday Cakes' },
    { id: 'Wedding Cakes', label: 'Wedding Cakes' },
    { id: 'Custom Cakes', label: 'Custom Cakes' },
    { id: 'Cupcakes', label: 'Cupcakes' },
    { id: 'Eggless Cake', label: 'Eggless Cakes' },
    { id: 'Chocolate Cakes', label: 'Chocolate Cakes' },
    { id: 'Fruit Cakes', label: 'Fruit Cakes' },
    { id: 'Cheesecakes', label: 'Cheesecakes' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-white to-pink-50">
      {/* Hero section with background */}
      <div className="relative bg-gradient-to-r from-pink-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-500 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500 rounded-full opacity-20 blur-3xl"></div>
        </div>
        <div className="container mx-auto px-4 py-12 md:py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Browse Our Delicious Cakes</h1>
            <p className="text-lg md:text-xl opacity-90 mb-8">Find the perfect cake for your special occasion</p>
            <Link
              to="/new-order"
              className="inline-flex items-center bg-white text-pink-600 font-medium px-6 py-3 rounded-lg hover:bg-pink-50 transition-colors shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Place New Order
            </Link>
          </div>
        </div>

        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto fill-current text-white">
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8 md:py-12 -mt-6 relative z-20">
        {/* Filter tabs */}
        <div className="mb-8 overflow-x-auto bg-white rounded-xl shadow-md p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 px-2">Filter by Category</h2>
          <div className="flex space-x-2 min-w-max pb-2">
            {filterOptions.map(option => (
              <button
                key={option.id}
                onClick={() => setActiveFilter(option.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeFilter === option.id
                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md transform scale-105'
                    : 'bg-white text-gray-700 hover:bg-pink-50 border border-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Order list with filter */}
        <OrderList categoryFilter={activeFilter === 'all' ? null : activeFilter} />
      </div>
    </div>
  );
}
