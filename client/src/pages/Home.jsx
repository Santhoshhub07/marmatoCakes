import Banner from '../components/Banner';
import OrderForm from '../components/OrderForm';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Banner />

      <section className="py-16 px-4 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-white via-pink-50 to-white opacity-70"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-100 rounded-full opacity-20 blur-3xl"></div>
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 inline-block mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mb-4"></div>
            <p className="text-gray-700 max-w-2xl mx-auto">We offer a variety of cake services to make your special occasions even sweeter.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-pink-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -right-6 -top-6 w-12 h-12 bg-pink-100 rounded-full opacity-30"></div>
              <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-pink-100 rounded-full opacity-30"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md relative z-10 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-800">Custom Cakes</h3>
              <p className="text-gray-600 relative z-10">Personalized cakes designed for your special occasions.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -right-6 -top-6 w-12 h-12 bg-purple-100 rounded-full opacity-30"></div>
              <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-purple-100 rounded-full opacity-30"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md relative z-10 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-800">Fast Delivery</h3>
              <p className="text-gray-600 relative z-10">We deliver your cakes fresh and on time, every time.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -right-6 -top-6 w-12 h-12 bg-blue-100 rounded-full opacity-30"></div>
              <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-blue-100 rounded-full opacity-30"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md relative z-10 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-800">Premium Quality</h3>
              <p className="text-gray-600 relative z-10">We use only the finest ingredients for our delicious cakes.</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute -right-6 -top-6 w-12 h-12 bg-green-100 rounded-full opacity-30"></div>
              <div className="absolute -left-6 -bottom-6 w-12 h-12 bg-green-100 rounded-full opacity-30"></div>
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md relative z-10 transform group-hover:scale-110 transition-transform">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3 relative z-10 text-gray-800">Easy Payment</h3>
              <p className="text-gray-600 relative z-10">Multiple payment options for your convenience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 opacity-80"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
        </div>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12 relative z-10">
              <div className="inline-block relative">
                <span className="absolute -top-6 -left-6 w-12 h-12 rounded-full bg-pink-200 opacity-50 blur-md"></span>
                <span className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-purple-200 opacity-50 blur-md"></span>
                <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 mb-4 relative">Order Your Dream Cake</h2>
              </div>
              <p className="text-gray-700 max-w-2xl mx-auto text-lg relative z-10">Fill out the form below to place your order. Our expert bakers will create a delicious cake just for you.</p>
            </div>
            <OrderForm />
          </div>
        </div>
      </section>
    </div>
  );
}
