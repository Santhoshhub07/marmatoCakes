const fs = require('fs-extra');
const path = require('path');
const https = require('https');

// Default image URLs for each category
const defaultImages = {
  'birthday_cakes.jpg': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80', // Birthday cake with candles
  'wedding_cakes.jpg': 'https://images.unsplash.com/photo-1565661834013-d196ca46e14e?w=800&q=80', // Elegant wedding cake
  'custom_cakes.jpg': 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=800&q=80', // Decorative custom cake
  'cupcakes.jpg': 'https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80', // Colorful cupcakes
  'eggless_cake.jpg': 'https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=800&q=80', // Eggless cake
  'chocolate_cakes.jpg': 'https://images.unsplash.com/photo-1605807646983-377bc5a76493?w=800&q=80', // Rich chocolate cake
  'fruit_cakes.jpg': 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&q=80', // Cake with fresh fruits
  'cheesecakes.jpg': 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&q=80', // Creamy cheesecake
};

// Directory to save images
const defaultImagesDir = path.join(__dirname, 'public', 'images', 'default');

// Ensure the directory exists
fs.ensureDirSync(defaultImagesDir);

// Download function
const downloadImage = (url, filename) => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(defaultImagesDir, filename);

    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`File ${filename} already exists, skipping...`);
      return resolve();
    }

    const file = fs.createWriteStream(filePath);

    https.get(url, (response) => {
      response.pipe(file);

      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete the file if there was an error
      console.error(`Error downloading ${filename}:`, err.message);
      reject(err);
    });
  });
};

// Download all images
const downloadAllImages = async () => {
  console.log('Starting download of default cake images...');

  const promises = Object.entries(defaultImages).map(([filename, url]) => {
    return downloadImage(url, filename);
  });

  try {
    await Promise.all(promises);
    console.log('All images downloaded successfully!');
  } catch (error) {
    console.error('Error downloading images:', error);
  }
};

// Run the download
downloadAllImages();
