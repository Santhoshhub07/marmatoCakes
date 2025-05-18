# Marmato Cakes Client

A React frontend for the Marmato Cakes ordering system.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your API URL.
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

The following environment variables are used:

- `VITE_API_URL`: The URL of the backend API (default: http://localhost:3001)

## Features

- View all cake orders
- Create new cake orders
- Update existing orders
- Delete orders
- Toast notifications for all API responses

## Technologies Used

- React
- React Router
- Axios
- React Toastify
- Tailwind CSS
- Vite
