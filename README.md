# 🛋️ FurniStore - Modern E-commerce Platform

A full-stack e-commerce application built with React, Node.js, MongoDB, and Stripe. Features include user authentication, product management, shopping cart, wishlist, and secure payment processing.

## 🌐 Live Demo

- **Frontend**: [https://furnishly.online](https://furnishly.online)
- **Backend API**: [https://furni-backend.onrender.com](https://furni-backend.onrender.com)

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm 8+
- MongoDB database
- Stripe account
- Gmail account with App Password (for email)

### Local Development

1. **Clone the repository**

   ```bash
   git clone https://github.com/Mananp1/furti_store.git
   cd furti_store
   ```

2. **Install dependencies**

   ```bash
   npm run install:all
   ```



3. **Start development servers**

   ```bash
   npm run dev
   ```

   This will start:

   - Frontend: http://localhost:5173
   - Backend: http://localhost:5001

## 🏗️ Project Structure

```
furti_store/
├── furni-store/                 # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── routes/            # TanStack Router routes
│   │   ├── features/          # Redux Toolkit slices
│   │   ├── lib/               # Utilities and hooks
│   │   └── store/             # Redux store configuration
│   ├── public/                # Static assets
│   └── dist/                  # Build output
├── server/                    # Backend (Node.js + Express)
│   ├── controllers/           # Route controllers
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── middleware/           # Express middleware
│   └── utils/                # Utility functions
└── package.json              # Root package.json for monorepo
```

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TanStack Router** - Client-side routing
- **TanStack Query** - Data fetching and caching
- **Redux Toolkit** - State management
- **Shadcn/ui** - UI components
- **Tailwind CSS** - Styling
- **React Hook Form** - Form handling
- **Zod** - Schema validation

### Backend

- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Better Auth** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email sending
- **CORS** - Cross-origin resource sharing

## 📚 API Documentation

### Authentication Routes

```
POST /api/auth/sign-in/magic-link    # Send magic link
GET  /api/auth/get-session           # Get current session
POST /api/auth/sign-out              # Sign out
DELETE /api/auth/delete-user         # Delete account
```

### Product Routes

```
GET    /api/products                 # Get all products
GET    /api/products/:id             # Get product by ID
POST   /api/products                 # Create product
PUT    /api/products/:id             # Update product
DELETE /api/products/:id             # Delete product
```

### User Routes

```
GET    /api/users/profile            # Get user profile
POST   /api/users/profile            # Create profile
PUT    /api/users/profile            # Update profile
DELETE /api/users/profile            # Delete account
POST   /api/users/addresses          # Add address
PUT    /api/users/addresses/:id      # Update address
GET    /api/users/states             # Get states list
GET    /api/users/cities/:state      # Get cities
```

### Cart Routes

```
GET    /api/cart                     # Get user cart
POST   /api/cart/add                 # Add to cart
PUT    /api/cart/update              # Update cart item
DELETE /api/cart/remove/:id          # Remove from cart
DELETE /api/cart/clear               # Clear cart
```

### Wishlist Routes

```
GET    /api/wishlist                 # Get wishlist
POST   /api/wishlist/add             # Add to wishlist
DELETE /api/wishlist/remove/:id      # Remove from wishlist
DELETE /api/wishlist/clear           # Clear wishlist
```

### Payment Routes

```
POST   /api/payments/create-payment-intent    # Create Stripe payment
POST   /api/payments/create-cod-order         # Create COD order
POST   /api/payments/confirm-payment          # Confirm payment
GET    /api/payments/history                  # Get payment history
POST   /api/payments/webhook                  # Stripe webhook
```

### Contact Routes

```
POST   /api/contact/submit           # Submit contact form
GET    /api/contact                  # Get all contacts (admin)
PATCH  /api/contact/:id/status       # Update contact status
```


## 📝 Features

### User Features

- ✅ Magic link authentication
- ✅ User profile management
- ✅ Address management
- ✅ Product browsing and search
- ✅ Shopping cart functionality
- ✅ Wishlist management
- ✅ Secure checkout with Stripe
- ✅ Cash on delivery option
- ✅ Order history
- ✅ Contact form with email notifications


### Technical Features

- ✅ Responsive design
- ✅ Progressive Web App (PWA)
- ✅ Real-time updates
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Image optimization


## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manan Patel**

- GitHub: [@Mananp1](https://github.com/Mananp1)
- Portfolio: https://manpatel.com

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [TanStack](https://tanstack.com/) for excellent React libraries
- [Stripe](https://stripe.com/) for payment processing
- [Better Auth](https://better-auth.com/) for authentication
- [Render](https://render.com/) for hosting

---

⭐ If you found this project helpful, please give it a star!
