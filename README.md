# 🛍️ Bazaario — Pakistan E-Commerce Platform

A full-stack **MERN e-commerce application** built for the Pakistani market.

Bazaario provides a complete shopping experience with user authentication, product browsing, cart management, checkout, Cash on Delivery, payment method selection, and a full-featured admin dashboard.

Built with **React, Vite, Tailwind CSS, Express.js, MongoDB, and JWT authentication**.

---

## 🚀 Features

### 👤 Authentication & Authorization

- User registration and login
- JWT-based authentication
- JWT stored in secure `httpOnly` cookies
- Protected routes
- Role-based authorization
- Customer and Admin roles
- Password hashing with bcrypt
- Authentication rate limiting

### 🛒 Shopping Experience

- Browse products
- Product categories
- Product search
- Product details
- Server-persisted shopping cart
- Guest cart support
- Guest cart → user cart merge after login
- Product stock management
- Discounted product prices

### 💳 Checkout & Orders

- Complete checkout flow
- Cash on Delivery (COD)
- JazzCash payment option
- Card payment option
- Order creation and management
- Stock validation during checkout
- Order status management

> **Note:** COD works end-to-end. JazzCash and Card are currently available as checkout options, but live payment gateway integration is not implemented yet.

### 🛠️ Admin Dashboard

- Dashboard statistics
- Product management
- Category management
- Order management
- User management
- Admin-only protected routes
- Server-side admin authorization

### 🔐 Security

- `httpOnly` JWT cookies
- Secure cookies in production
- `sameSite` cookie configuration
- Helmet security headers
- CORS with locked origins
- MongoDB sanitization
- Authentication rate limiting
- Request validation with `express-validator`
- Image MIME type and size validation
- Passwords are never returned to clients
- Environment variables for secrets
- Centralized error handling
- Stack traces are never exposed to clients

### 🖼️ Image Uploads

Product image uploads are supported through **Cloudinary**.

Cloudinary configuration is optional. Without Cloudinary credentials, products can still be created, but they will be saved without images.

---

## 🧰 Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- Axios

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-validator
- Helmet
- express-rate-limit
- express-mongo-sanitize
- Cloudinary

### Deployment

The application can be deployed using:

- **Vercel / Netlify** → Frontend
- **Render / Railway** → Backend
- **MongoDB Atlas** → Database

---

## 📁 Project Structure

```text
ecommerce-pk/
│
├── client/                 # React + Vite frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
│
├── server/                 # Express + MongoDB backend
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md
```

---

# ⚙️ Getting Started

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) 18 or later
- MongoDB

You can use either:

- Local MongoDB
- [MongoDB Atlas](https://www.mongodb.com/atlas)

For product image uploads, you can optionally create a:

- [Cloudinary](https://cloudinary.com/) account

---

# 🔧 Backend Setup

Open a terminal and navigate to the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

On Windows, you can also manually create a `.env` file based on `.env.example`.

### Environment Variables

Open:

```text
server/.env
```

and configure your environment variables:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
COOKIE_SECRET=your_long_random_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Cloudinary variables are optional if you don't need product image uploads.

> **Important:** Never commit your `.env` file to GitHub.

---

## 🌱 Seed the Database

The project includes a seed script that creates:

- An admin account
- A customer account
- Product categories
- Sample products

Run:

```bash
npm run seed
```

The seed script provides the following test accounts:

### Admin

```text
Email:    admin@example.com
Password: admin1234
```

### Customer

```text
Email:    customer@example.com
Password: customer1234
```

> **Security note:** These are development/test credentials only. Change or remove them before using the application in a real production environment.

---

## ▶️ Start the Backend

For development:

```bash
npm run dev
```

The API will run on:

```text
http://localhost:5000
```

You can check whether the server is running by visiting:

```text
GET /api/health
```

---

# 🎨 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Configure:

```env
VITE_API_URL=http://localhost:5000/api
```

Then start the frontend:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

# 🔑 Using the Application

Once both frontend and backend are running:

1. Open the frontend in your browser.
2. Register a new customer account or use the seeded customer account.
3. Browse products.
4. Add products to your cart.
5. Proceed to checkout.
6. Select a payment method.
7. Place an order.
8. Log in using the admin account to access:

```text
/admin
```

The admin dashboard provides access to product, order, user, and statistics management.

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────┐
                         │     Browser      │
                         │   React + Vite    │
                         └────────┬─────────┘
                                  │
                                  │ HTTP / REST API
                                  ↓
                         ┌──────────────────┐
                         │  Express Server  │
                         │   Node.js API    │
                         └────────┬─────────┘
                                  │
                     ┌────────────┴────────────┐
                     ↓                         ↓
              ┌──────────────┐          ┌──────────────┐
              │   MongoDB    │          │  Cloudinary  │
              │   Database   │          │    Images    │
              └──────────────┘          └──────────────┘
```

---

# 🔐 Authentication Flow

Bazaario uses JWT authentication with secure HTTP-only cookies.

```text
User Login
    ↓
Express API
    ↓
Validate Credentials
    ↓
Verify Password with bcrypt
    ↓
Generate JWT
    ↓
Set HTTP-only Cookie
    ↓
Authenticated Requests
    ↓
Backend Verifies JWT
    ↓
Access Protected Resources
```

The JWT is not stored directly in browser-accessible JavaScript storage.

---

# 🛒 Cart Flow

The application supports both guest and authenticated carts.

```text
Guest User
    ↓
Guest Cart
    ↓
User Logs In
    ↓
Guest Cart Merged
    ↓
Server-Persisted User Cart
```

This allows users to add products before logging in and keep those items after authentication.

---

# 📦 Order & Stock Handling

During checkout, product stock and pricing are validated on the server.

The application uses an atomic conditional `findOneAndUpdate` operation for each order item.

If a later item fails during the order process, previously updated stock can be rolled back manually.

This approach avoids requiring MongoDB transactions for local development.

> MongoDB transactions require a replica-set configuration. MongoDB Atlas clusters provide replica-set functionality by default, so transactions can be introduced later if required.

---

# 💳 Payment Methods

The checkout currently supports:

### Cash on Delivery

Fully implemented end-to-end.

### JazzCash

Available as a checkout option and stored with the order.

Live JazzCash gateway integration is not currently implemented.

### Card

Available as a checkout option and stored with the order.

A real payment processor has not yet been integrated.

---

# 🖼️ Cloudinary Image Uploads

Cloudinary is used for product image uploads.

If Cloudinary credentials are not provided:

```text
Product creation
      ↓
Product saved successfully
      ↓
No product images
```

If Cloudinary is configured:

```text
Product image
      ↓
Backend
      ↓
Cloudinary
      ↓
Image URL
      ↓
MongoDB
```

---

# 🛡️ Security Measures

The project implements several security practices:

- JWT authentication
- HTTP-only cookies
- Secure cookies in production
- SameSite cookie configuration
- Helmet
- CORS restrictions
- MongoDB query sanitization
- Rate limiting
- Request validation
- Password hashing
- Server-side authorization
- Admin role verification
- Environment-based secrets
- Image upload restrictions
- Centralized error handling
- No stack traces exposed to clients
- Passwords excluded from API responses

---

# 📌 API Health Check

The backend provides a simple health endpoint:

```http
GET /api/health
```

Expected response:

```json
{
  "status": "ok"
}
```

This can also be useful when checking whether a deployed backend is running correctly.

---

# 🚧 Future Improvements

The following features can be added in future versions:

- [ ] Real JazzCash sandbox integration
- [ ] Real card payment gateway
- [ ] Product reviews and ratings
- [ ] Email notifications for order status changes
- [ ] Wishlist
- [ ] Advanced product filtering
- [ ] Pagination improvements
- [ ] Automated tests
- [ ] Docker configuration
- [ ] CI/CD pipeline
- [ ] Production deployment configuration

---

# 🌐 Deployment

The project uses a monorepo-style structure, so the frontend and backend can remain in the same GitHub repository.

```text
GitHub Repository
│
├── client/ ──────→ Vercel / Netlify
│
└── server/ ──────→ Render / Railway
```

### Frontend

Set the frontend root directory to:

```text
client
```

and configure:

```env
VITE_API_URL=https://your-backend-url.com/api
```

### Backend

Set the backend root directory to:

```text
server
```

and configure the required environment variables on your hosting provider.

---

# 📄 License

This project is intended for learning, portfolio, and demonstration purposes.
