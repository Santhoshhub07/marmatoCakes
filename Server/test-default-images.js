const http = require('http');
const fs = require('fs-extra');
const path = require('path');

// Get the port from the .env file or use default
require('dotenv').config();
const PORT = process.env.PORT || 3000;

// Default image categories
const categories = [
  'birthday_cakes',
  'wedding_cakes',
  'custom_cakes',
  'cupcakes',
  'eggless_cake',
  'chocolate_cakes',
  'fruit_cakes',
  'cheesecakes'
];

// Function to test if an image is accessible
const testImageAccess = (category) => {
  return new Promise((resolve, reject) => {
    const url = `http://localhost:${PORT}/images/default/${category}.jpg`;
    
    http.get(url, (res) => {
      if (res.statusCode === 200) {
        console.log(`✅ ${category}.jpg is accessible`);
        resolve(true);
      } else {
        console.error(`❌ ${category}.jpg returned status code ${res.statusCode}`);
        resolve(false);
      }
      
      // Consume response data to free up memory
      res.resume();
    }).on('error', (err) => {
      console.error(`❌ Error accessing ${category}.jpg: ${err.message}`);
      console.error(`   Make sure the server is running on port ${PORT}`);
      resolve(false);
    });
  });
};

// Check if the server is running
const checkServerRunning = () => {
  return new Promise((resolve) => {
    http.get(`http://localhost:${PORT}`, (res) => {
      resolve(true);
      res.resume();
    }).on('error', () => {
      resolve(false);
    });
  });
};

// Main function
const main = async () => {
  console.log('Testing access to default cake images...');
  
  // Check if server is running
  const serverRunning = await checkServerRunning();
  if (!serverRunning) {
    console.error('❌ Server is not running. Please start the server first.');
    console.error(`   Expected server URL: http://localhost:${PORT}`);
    return;
  }
  
  console.log('✅ Server is running');
  
  // Check if all images are accessible
  const results = await Promise.all(categories.map(category => testImageAccess(category)));
  
  // Check if all images are accessible
  const allAccessible = results.every(result => result);
  
  if (allAccessible) {
    console.log('\n✅ All default cake images are accessible!');
  } else {
    console.log('\n❌ Some default cake images are not accessible.');
    console.log('   Please check the server configuration and image files.');
  }
};

// Run the main function
main();
