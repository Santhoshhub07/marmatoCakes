require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs-extra");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*', // Use environment variable or allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
// Increase JSON body size limit to 10mb (or higher if needed)
app.use(express.json());

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
fs.ensureDirSync(uploadsDir);

// Create public/images/default directory if it doesn't exist
const defaultImagesDir = path.join(__dirname, 'public', 'images', 'default');
fs.ensureDirSync(defaultImagesDir);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve static files from the public directory for default images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connection successful"))
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
    if (err.name === 'MongoServerSelectionError') {
      console.error("Could not connect to MongoDB server. Please check your connection string and network.");
    }
  });

const db = mongoose.connection;
db.on("error", (error) => console.error("MongoDB connection error:", error));
db.once("open", () => console.log("Connected to MongoDB"));

const orderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  food: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Birthday Cakes', 'Wedding Cakes', 'Custom Cakes', 'Cupcakes', 'Eggless Cake', 'Chocolate Cakes', 'Fruit Cakes', 'Cheesecakes']
  },
  photoPath: { type: String, required: true }, // Store the path to the image
  useDefaultImage: { type: Boolean, default: false }, // Flag to indicate if using default image
}, {
  timestamps: true, // Add createdAt and updatedAt fields
  toJSON: {
    virtuals: true,
    transform: function(doc, ret) {
      // Add full URL to the photo
      if (ret.photoPath) {
        if (ret.useDefaultImage) {
          // If using default image, construct URL based on category
          // Make sure category is a string and convert it properly
          const categoryStr = String(ret.category || '');
          const category = categoryStr.replace(/\s+/g, '_').toLowerCase();
          ret.photoUrl = `${process.env.SERVER_URL || `http://localhost:${PORT}`}/images/default/${category}.jpg`;
        } else {
          // Otherwise use the uploaded image
          ret.photoUrl = `${process.env.SERVER_URL || `http://localhost:${PORT}`}/uploads/${ret.photoPath}`;
        }
      }
      return ret;
    }
  }
});

const Order = mongoose.model("Order", orderSchema);

// Handle file upload for new orders
app.post("/order", upload.single('photo'), async (req, res) => {
  try {
      // Check if using default image
    const useDefaultImage = req.body.useDefaultImage === 'true';

    // Log the request body and file to debug
    console.log('Request body:', req.body);
    console.log('Using default image:', useDefaultImage);
    console.log('Category type:', typeof req.body.category);
    console.log('Category value:', req.body.category);

    if (!useDefaultImage && !req.file) {
      return res.status(400).json({ error: "Please upload a cake photo or use a default image" });
    }

    if (req.file) {
      console.log('Uploaded file:', req.file.filename);
    }

    // Create new order with file path
    const orderData = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      city: req.body.city,
      pincode: req.body.pincode,
      food: req.body.food,
      category: req.body.category,
      useDefaultImage: useDefaultImage
    };

    // Set photoPath based on whether using default image or uploaded file
    if (useDefaultImage) {
      // Make sure category is a string and convert it properly
      const categoryStr = String(req.body.category || '');
      // Use a placeholder value for photoPath when using default images
      orderData.photoPath = `default_${categoryStr.replace(/\s+/g, '_').toLowerCase()}`;
    } else {
      orderData.photoPath = req.file.filename; // Store just the filename
    }

    // Validate that all required fields are present
    const requiredFields = ['name', 'phone', 'address', 'city', 'pincode', 'food', 'category', 'photoPath'];
    const missingFields = requiredFields.filter(field => !orderData[field]);

    if (missingFields.length > 0) {
      // Delete the uploaded file since we're not saving the order
      if (req.file) {
        fs.removeSync(path.join(uploadsDir, req.file.filename));
      }
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    const order = new Order(orderData);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.removeSync(path.join(uploadsDir, req.file.filename));
    }

    // Handle multer errors
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
      }
      return res.status(400).json({ error: err.message });
    }

    console.error('Error creating order:', err);
    res.status(400).json({ error: err.message });
  }
});

app.get("/order", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Handle file upload for updating orders
app.put("/order", upload.single('photo'), async (req, res) => {
  try {
    const { _id, ...updateFields } = req.body;

    if (!_id) {
      return res.status(400).json({ error: "Order _id required for update" });
    }

    // Log the request body and file to debug
    console.log('Update request body:', req.body);
    console.log('Update file:', req.file ? req.file.filename : 'No file uploaded');
    console.log('Update category type:', typeof updateFields.category);
    console.log('Update category value:', updateFields.category);

    // Find the existing order
    const existingOrder = await Order.findById(_id);
    if (!existingOrder) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Check if using default image
    const useDefaultImage = updateFields.useDefaultImage === 'true';
    console.log('Using default image for update:', useDefaultImage);

    // Create update object with explicit fields
    const update = {
      name: updateFields.name,
      phone: updateFields.phone,
      address: updateFields.address,
      city: updateFields.city,
      pincode: updateFields.pincode,
      food: updateFields.food,
      category: updateFields.category,
      useDefaultImage: useDefaultImage
    };

    if (useDefaultImage) {
      // Using default image based on category
      console.log('Using default image for category:', update.category);

      // If switching from custom to default and there was a custom image, delete it
      if (!existingOrder.useDefaultImage && existingOrder.photoPath && !existingOrder.photoPath.startsWith('default_')) {
        const oldFilePath = path.join(uploadsDir, existingOrder.photoPath);
        if (fs.existsSync(oldFilePath)) {
          fs.removeSync(oldFilePath);
        }
      }

      // Make sure category is a string and convert it properly
      const categoryStr = String(update.category || '');
      // Set a placeholder value for photoPath
      update.photoPath = `default_${categoryStr.replace(/\s+/g, '_').toLowerCase()}`;
    }
    // If a new file was uploaded, update the photo path and delete the old file
    else if (req.file) {
      console.log('New file uploaded for update:', req.file.filename);

      // Delete the old file if it exists and is not a default image
      if (existingOrder.photoPath && !existingOrder.photoPath.startsWith('default_')) {
        const oldFilePath = path.join(uploadsDir, existingOrder.photoPath);
        if (fs.existsSync(oldFilePath)) {
          fs.removeSync(oldFilePath);
        }
      }

      // Update with new file path
      update.photoPath = req.file.filename;
    }
    // If not using default and no new file uploaded, keep existing photo
    else {
      // If no new file was uploaded, keep the existing photo path
      console.log('No new file uploaded, keeping existing photo:', existingOrder.photoPath);

      // Don't include photoPath in the update object - this will keep the existing value
      // But make sure the existing photo exists
      if (!existingOrder.photoPath) {
        return res.status(400).json({ error: "Photo is required" });
      }

      // Remove photoPath from update to keep the existing one
      delete update.photoPath;
    }

    // Validate that all required fields are present
    const requiredFields = ['name', 'phone', 'address', 'city', 'pincode', 'food', 'category'];
    const missingFields = requiredFields.filter(field => !update[field]);

    if (missingFields.length > 0) {
      // Delete the uploaded file if there was one
      if (req.file) {
        fs.removeSync(path.join(uploadsDir, req.file.filename));
      }
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(_id, update, { new: true });
    res.json(order);
  } catch (err) {
    // If there was an error and a file was uploaded, delete it
    if (req.file) {
      fs.removeSync(path.join(uploadsDir, req.file.filename));
    }

    console.error('Error updating order:', err);
    res.status(400).json({ error: err.message });
  }
});

app.delete("/order", async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res.status(400).json({ error: "Order _id required for deletion" });
    }

    // Find the order first to get the photo path
    const order = await Order.findById(_id);

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Delete the associated image file if it exists
    if (order.photoPath) {
      const filePath = path.join(uploadsDir, order.photoPath);
      if (fs.existsSync(filePath)) {
        fs.removeSync(filePath);
      }
    }

    // Delete the order from the database
    await Order.findByIdAndDelete(_id);

    res.json({ message: "Order deleted", order });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
