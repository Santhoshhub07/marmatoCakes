# Marmato Cakes - Cake Delivery Website

A full-stack web application for ordering cakes online. This project includes both client and server components.

## Features

- Browse cake categories
- Place cake orders with optional image upload
- Default cake images for each category
- View and manage orders
- Responsive design for all devices

## Project Structure

- `/client` - React frontend built with Vite and TailwindCSS
- `/Server` - Node.js backend with Express and MongoDB

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas connection)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

First, install the dependencies for both the client and server:

```bash
# Install server dependencies
cd Server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Configuration

#### Server (.env file in /Server directory)
```
PORT=3000
MONGODB_URI=your_mongodb_connection_string
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
SERVER_URL=http://localhost:3000
```

#### Client (.env file in /client directory)
```
VITE_API_URL=http://localhost:3000
```

### 3. Default Images

The server includes default cake images for each category. These are stored in:
```
/Server/public/images/default/
```

If you want to use your own default images, replace the files in this directory with your own images, following the naming convention:
- birthday_cakes.jpg
- wedding_cakes.jpg
- custom_cakes.jpg
- cupcakes.jpg
- eggless_cake.jpg
- chocolate_cakes.jpg
- fruit_cakes.jpg
- cheesecakes.jpg

### 4. Running the Application

#### Option 1: Using the start script (Windows)

Run the provided start.bat file to start both client and server:
```
start.bat
```

#### Option 2: Manual start

Start the server:
```bash
cd Server
npm start
```

Start the client (in a new terminal):
```bash
cd client
npm run dev
```

### 5. Access the Application

- Client: http://localhost:5173
- Server API: http://localhost:3000

## API Endpoints

- `GET /order` - Get all orders
- `POST /order` - Create a new order
- `PUT /order` - Update an existing order
- `DELETE /order` - Delete an order

## Technologies Used

### Frontend
- React
- Vite
- TailwindCSS
- React Router
- Axios
- React Toastify

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Multer (for file uploads)
- CORS
- dotenv

## License

This project is licensed under the MIT License.
