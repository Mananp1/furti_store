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
- Mailtrap account (for email)

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

3. **Set up environment variables**

   **Frontend** (`furni-store/.env.local`):

   ```env
   VITE_API_URL=http://localhost:5001/api
   VITE_APP_URL=http://localhost:5173
   VITE_AUTH_URL=http://localhost:5001
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   ```

   **Backend** (`server/.env`):

   ```env
   MONGO_URI=mongodb://localhost:27017
   MONGO_DB_NAME=store_db
   MAILTRAP_USER=your_mailtrap_user
   MAILTRAP_PASS=your_mailtrap_pass
   STRIPE_SECRET_KEY=sk_test_your_key
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   FRONTEND_URL=http://localhost:5173
   ADMIN_EMAIL=admin@example.com
   ```

4. **Start development servers**

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

## 🚀 Deployment

### Render Deployment (Recommended)

#### 1. Frontend Service (Static Site)

- **Build Command**: `npm run build:frontend`
- **Publish Directory**: `furni-store/dist`
- **Environment Variables**:
  ```env
  VITE_API_URL=https://your-backend-service.onrender.com/api
  VITE_APP_URL=https://your-frontend-domain.com
  VITE_AUTH_URL=https://your-backend-service.onrender.com
  VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
  ```

#### 2. Backend Service (Web Service)

- **Build Command**: `npm run build:backend`
- **Start Command**: `npm start`
- **Environment Variables**:
  ```env
  MONGO_URI=your_mongodb_uri
  MONGO_DB_NAME=store_db
  MAILTRAP_USER=your_mailtrap_user
  MAILTRAP_PASS=your_mailtrap_pass
  STRIPE_SECRET_KEY=sk_test_...
  STRIPE_WEBHOOK_SECRET=whsec_...
  FRONTEND_URL=https://your-frontend-domain.com
  ADMIN_EMAIL=admin@yourdomain.com
  ```

### VPS Deployment

#### 1. Build Frontend

```bash
cd furni-store
npm run build
```

#### 2. Deploy to VPS

```bash
# Copy files to VPS
scp -r furni-store/dist/* user@your-vps:/var/www/furnishly/furni-store/dist/
scp -r server/* user@your-vps:/var/www/furnishly/server/
```

#### 3. Start Backend

```bash
cd /var/www/furnishly/server
pm2 start server.js --name "furni-backend"
pm2 save
pm2 startup
```

#### 4. Configure Nginx

```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/furnishly/furni-store/dist;
    index index.html;

    # API proxy
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🔧 Available Scripts

### Root Level

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build frontend
npm run start            # Start backend
npm run install:all      # Install all dependencies
```

### Frontend (furni-store/)

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run lint             # Run ESLint
```

### Backend (server/)

```bash
npm run dev              # Start with nodemon
npm start                # Start production server
```

## 🔐 Environment Variables

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend-domain.com/api
VITE_APP_URL=https://your-frontend-domain.com
VITE_AUTH_URL=https://your-backend-domain.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017
MONGO_DB_NAME=store_db
MAILTRAP_USER=your_mailtrap_user
MAILTRAP_PASS=your_mailtrap_pass
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
FRONTEND_URL=https://your-frontend-domain.com
ADMIN_EMAIL=admin@yourdomain.com
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
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

### Admin Features

- ✅ Product management (CRUD)
- ✅ Order management
- ✅ Contact form submissions
- ✅ Payment tracking

### Technical Features

- ✅ Responsive design
- ✅ Progressive Web App (PWA)
- ✅ Real-time updates
- ✅ Error handling
- ✅ Loading states
- ✅ Form validation
- ✅ Image optimization
- ✅ SEO optimization

## 🐛 Troubleshooting

### Common Issues

#### 1. Build Errors

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 2. Port Conflicts

```bash
# Kill process using port 5001
sudo lsof -ti:5001 | xargs kill -9
```

#### 3. MongoDB Connection

```bash
# Check MongoDB status
sudo systemctl status mongod
```

#### 4. Environment Variables

```bash
# Verify environment variables are loaded
echo $MONGO_URI
```

### Render Deployment Issues

Based on [Render's troubleshooting guide](https://render.com/docs/troubleshooting-deploys):

1. **Check build logs** in Render Dashboard
2. **Verify environment variables** are set correctly
3. **Ensure Node.js version** matches your local setup
4. **Check file paths** are correct for your project structure

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Manan Patel**

- GitHub: [@Mananp1](https://github.com/Mananp1)
- Email: mananp1979@gmail.com

## 🙏 Acknowledgments

- [Shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [TanStack](https://tanstack.com/) for excellent React libraries
- [Stripe](https://stripe.com/) for payment processing
- [Better Auth](https://better-auth.com/) for authentication
- [Render](https://render.com/) for hosting

---

⭐ If you found this project helpful, please give it a star!
