import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { orderService } from '../services/api';
import defaultImages from '../utils/defaultImages';

export default function OrderForm({ existingOrder = null }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: existingOrder?.name || '',
    phone: existingOrder?.phone || '',
    address: existingOrder?.address || '',
    city: existingOrder?.city || '',
    pincode: existingOrder?.pincode || '',
    food: existingOrder?.food || '',
    category: existingOrder?.category || 'Birthday Cakes', // Default to Birthday Cakes
    photo: null, // Will be set to File object when user selects a file
    useDefaultImage: !existingOrder?.photoUrl, // Use default image if no existing photo
  });

  // Store the existing image URL separately
  const [existingImageUrl, setExistingImageUrl] = useState(existingOrder?.photoUrl || '');

  // Cake categories
  const cakeCategories = [
    'Birthday Cakes',
    'Wedding Cakes',
    'Custom Cakes',
    'Cupcakes',
    'Eggless Cake',
    'Chocolate Cakes',
    'Fruit Cakes',
    'Cheesecakes'
  ];
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone number validation - only allow digits and limit to 10 digits
    if (name === 'phone') {
      const phoneRegex = /^\d*$/; // Only digits
      if (!phoneRegex.test(value)) {
        return; // Don't update if non-digit characters
      }
      if (value.length > 10) {
        return; // Don't update if more than 10 digits
      }
    }

    // For category changes, update the useDefaultImage flag if no custom photo is selected
    if (name === 'category' && !formData.photo) {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        useDefaultImage: true
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }

      // Set the photo and mark that we're not using the default image
      setFormData(prev => ({
        ...prev,
        photo: file,
        useDefaultImage: false
      }));
    }
  };

  // Function to toggle between default image and custom upload
  const toggleDefaultImage = () => {
    setFormData(prev => ({
      ...prev,
      useDefaultImage: !prev.useDefaultImage,
      photo: null // Clear any selected photo when switching to default
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Form validation
    if (!formData.name.trim()) {
      toast.error('Please enter your name');
      return;
    }

    if (!formData.phone.trim()) {
      toast.error('Please enter your phone number');
      return;
    }

    if (!formData.address.trim()) {
      toast.error('Please enter your address');
      return;
    }

    if (!formData.city.trim() || !formData.pincode.trim()) {
      toast.error('Please enter your city and pincode');
      return;
    }

    if (!formData.food.trim()) {
      toast.error('Please enter the cake type');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a cake category');
      return;
    }

    // Phone number validation - must be exactly 10 digits
    if (formData.phone.trim().length !== 10) {
      toast.error('Phone number must be exactly 10 digits');
      return;
    }

    setIsSubmitting(true);

    try {
      // Create a FormData object to send the file
      const formDataToSend = new FormData();

      // Add all text fields
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('address', formData.address.trim());
      formDataToSend.append('city', formData.city.trim());
      formDataToSend.append('pincode', formData.pincode.trim());
      formDataToSend.append('food', formData.food.trim());

      // Make sure category is a string
      const categoryStr = String(formData.category || '');
      formDataToSend.append('category', categoryStr);

      // Log for debugging
      console.log('Category being sent:', categoryStr, typeof categoryStr);

      // Add the file if it's a File object
      if (formData.photo instanceof File) {
        formDataToSend.append('photo', formData.photo);
        formDataToSend.append('useDefaultImage', 'false');
      } else if (existingOrder && !formData.useDefaultImage) {
        // If we're updating an existing order and no new photo was selected,
        // we don't need to send the photo again - the server will keep the existing one
        console.log('Using existing photo, not sending a new one');
        formDataToSend.append('useDefaultImage', 'false');
      } else {
        // Using default image based on category
        console.log('Using default image for category:', formData.category);
        formDataToSend.append('useDefaultImage', 'true');
        // Category is already appended above, no need to append it again
      }

      // Log the form data to debug
      console.log('Form data being sent:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'photo' ? 'File object' : pair[1]));
      }

      if (existingOrder?._id) {
        // Add the ID for updates
        formDataToSend.append('_id', existingOrder._id);
        await orderService.updateOrder(formDataToSend);
        toast.success('Order updated successfully!');
      } else {
        await orderService.createOrder(formDataToSend);
        toast.success('Order placed successfully!');
      }
      navigate('/orders');
    } catch (err) {
      // Show the specific error message from the server if available
      if (err.response && err.response.data && err.response.data.error) {
        toast.error(`Error: ${err.response.data.error}`);
      } else {
        toast.error('Failed to submit the form. Please try again.');
      }
      console.error('Form submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-0 sm:p-0 bg-transparent rounded-lg" id="order-section">
      <div className="relative bg-gradient-to-br from-pink-100 to-purple-50 rounded-t-lg overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-0 w-24 h-24 bg-pink-200 rounded-full -translate-x-1/2 -translate-y-1/2 opacity-60"></div>
          <div className="absolute top-10 right-10 w-16 h-16 bg-purple-200 rounded-full opacity-60"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-200 rounded-full translate-x-1/2 translate-y-1/2 opacity-60"></div>
        </div>

        <div className="relative p-6 sm:p-8">
          <div className="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
            </svg>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {existingOrder ? 'Update Your Order' : 'Place Your Order'}
            </h2>
          </div>
          <p className="text-center text-gray-600 mb-6">Fill in the details below to order your delicious cake</p>
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-b-lg shadow-lg border-t border-pink-100">
        <form onSubmit={handleSubmit} className="space-y-6">
        <div className="relative">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Full Name
            </span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all bg-white hover:bg-gray-50 focus:bg-white"
            placeholder="Enter your full name"
            autocomplete="off"
          />
        </div>

        <div className="relative">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Phone Number
            </span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all bg-white hover:bg-gray-50 focus:bg-white"
            placeholder="Enter your phone number"
            max="9999999999"
            autocomplete="off"
          />
        </div>

        <div className="relative">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Address
            </span>
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all bg-white hover:bg-gray-50 focus:bg-white"
            placeholder="Enter your street address"
            autocomplete="off"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                City
              </span>
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all bg-white hover:bg-gray-50 focus:bg-white"
              placeholder="Enter your city"
              autocomplete="off"
            />
          </div>

          <div className="relative">
            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Pincode
              </span>
            </label>
            <input
              type="text"
              id="pincode"
              name="pincode"
              value={formData.pincode}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all bg-white hover:bg-gray-50 focus:bg-white"
              placeholder="Enter your pincode"
              autocomplete="off"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative">
            <label htmlFor="food" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15.546c-.523 0-1.046.151-1.5.454a2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.704 2.704 0 00-3 0 2.704 2.704 0 01-3 0 2.701 2.701 0 00-1.5-.454M9 6v2m3-2v2m3-2v2M9 3h.01M12 3h.01M15 3h.01M21 21v-7a2 2 0 00-2-2H5a2 2 0 00-2 2v7h18zm-3-9v-2a2 2 0 00-2-2H8a2 2 0 00-2 2v2h12z" />
                </svg>
                Cake Type
              </span>
            </label>
            <input
              type="text"
              id="food"
              name="food"
              value={formData.food}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all bg-white hover:bg-gray-50 focus:bg-white"
              placeholder="e.g. Chocolate Truffle, Red Velvet"
              autocomplete="off"
            />
          </div>

          <div className="relative">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Cake Category
              </span>
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-pink-500 focus:border-pink-500 shadow-sm transition-all bg-white hover:bg-gray-50 focus:bg-white appearance-none"
              >
                {cakeCategories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-pink-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Cake Photo
              </span>
            </label>

            {/* Toggle switch for default image */}
            <div className="flex items-center">
              <span className="text-sm text-gray-500 mr-2">Use default image</span>
              <button
                type="button"
                onClick={toggleDefaultImage}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${formData.useDefaultImage ? 'bg-pink-600' : 'bg-gray-200'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.useDefaultImage ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
            </div>
          </div>

          {formData.useDefaultImage ? (
            <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50">
              <div className="text-center mb-2">
                <p className="text-sm font-medium text-gray-700">Using default image for {formData.category}</p>
              </div>
              <div className="relative">
                <img
                  src={defaultImages[formData.category] || 'https://via.placeholder.com/400x300?text=Default+Image'}
                  alt={`Default ${formData.category}`}
                  className="h-48 w-full object-cover rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x300?text=Default+Image';
                  }}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-200 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                <div className="space-y-1 text-center">
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label htmlFor="photo" className="relative cursor-pointer bg-white rounded-md font-medium text-pink-600 hover:text-pink-500 focus-within:outline-none">
                      <span>Upload a file</span>
                      <input
                        id="photo"
                        name="photo"
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        className="sr-only"
                        autocomplete="off"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>

              {/* Show image preview */}
              {(formData.photo || existingImageUrl) && (
                <div className="mt-4 p-2 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="relative">
                    <img
                      src={formData.photo instanceof File
                        ? URL.createObjectURL(formData.photo)
                        : existingImageUrl || ''}
                      alt="Cake preview"
                      className="h-48 w-full object-cover rounded-md"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                      }}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-md">
                      <button
                        type="button"
                        className="bg-white p-2 rounded-full shadow-md"
                        onClick={() => setFormData(prev => ({ ...prev, photo: null }))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {existingImageUrl && !formData.photo && (
                    <p className="text-sm text-gray-500 mt-2 text-center">
                      Current image will be kept unless you select a new one
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-pink-500 to-pink-600 text-white py-3 px-4 rounded-lg hover:from-pink-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-all shadow-md disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5 active:translate-y-0 text-lg font-medium"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              <span>{existingOrder ? 'Update Order' : 'Place Order'}</span>
            )}
          </button>
        </div>
      </form>
      </div>
    </div>
  );
}
