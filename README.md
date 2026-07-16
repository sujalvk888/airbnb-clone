<div align="center">
  
# 🏡 Airbnb Clone

</div>

<div align="center">

### A Full-Stack Accommodation Marketplace Built with React, Express, Prisma & PostgreSQL

Discover unique stays, list properties, manage bookings, process secure payments, and build unforgettable travel experiences through a modern Airbnb-inspired platform.

<p>
  <a href="https://airbnb-clone-fullstack-web.vercel.app" target="_blank">
    <img src="https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-2563EB?style=for-the-badge" alt="Live Demo"/>
  </a>
  <a href="https://airbnb-clone-backend-em8f.onrender.com" target="_blank">
    <img src="https://img.shields.io/badge/API-Backend-16A34A?style=for-the-badge" alt="Backend API"/>
  </a>
</p>

<p>
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express.js-5-000000?style=flat-square&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=node.js&logoColor=white"/>
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma&logoColor=white"/>
  <img src="https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-v3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/JWT-Authentication-F59E0B?style=flat-square"/>
  <img src="https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe&logoColor=white"/>
  <img src="https://img.shields.io/badge/Cloudinary-Image_Storage-3448C5?style=flat-square&logo=cloudinary&logoColor=white"/>
  <img src="https://img.shields.io/badge/Responsive-Mobile_Ready-0EA5E9?style=flat-square"/>
</p>

</div>

---

# 📖 Overview

**Airbnb Clone** is a production-inspired full-stack accommodation marketplace that allows users to discover unique properties, list accommodations, manage bookings, maintain wishlists, leave reviews, and securely complete reservations through an integrated payment workflow.

Built using **React**, **Express.js**, **Prisma ORM**, **PostgreSQL**, and **Stripe**, the platform demonstrates how modern marketplace applications manage complex relationships between guests, hosts, listings, reservations, payments, notifications, and media assets.

The application combines a responsive user experience with a secure backend architecture, emphasizing authentication, relational database design, cloud-based image management, and production-ready API security.

Whether you're exploring destinations, hosting a property, or studying full-stack marketplace architecture, Airbnb Clone provides a realistic implementation of a modern accommodation booking platform.

---

# ✨ Features

## 🔐 Secure Authentication

The platform provides a secure authentication system for both guests and hosts.

Features include:

- Email & Password Registration
- Secure Login
- JWT Authentication
- Password Hashing using bcryptjs
- Protected Routes
- Persistent User Sessions

---

## 🏡 Property Listings

Hosts can create and manage accommodation listings.

Each listing includes:

- Property Title
- Description
- Property Type
- Location
- Guest Capacity
- Bedrooms
- Beds
- Bathrooms
- Pricing
- Cleaning Fee
- Discount Percentage

---

## 🛋️ Comprehensive Amenities

Each property supports a rich set of amenities, allowing guests to quickly compare accommodations.

Examples include:

- Wi-Fi
- Swimming Pool
- Kitchen
- Dedicated Workspace
- Air Conditioning
- Heating
- Gym
- And more...

---

## 📅 Booking Management

Guests can reserve available properties through a streamlined booking workflow.

Booking features include:

- Check-in & Check-out Selection
- Booking Confirmation
- Reservation Status
- Total Price Calculation
- Trip Management

---

## ❤️ Wishlist System

Users can save their favorite properties for future trips.

Highlights include:

- Add to Wishlist
- Remove from Wishlist
- Instant UI Updates
- Optimized State Synchronization
- No Page Refresh Required

---

## ⭐ Reviews & Ratings

Guests can share their experiences by submitting reviews.

Review functionality includes:

- Ratings
- Written Reviews
- Listing Feedback
- Community Trust

---

## 💳 Secure Stripe Payments

The platform integrates Stripe to securely process reservation payments.

Payment workflow includes:

- Secure Checkout
- Payment Processing
- Booking Confirmation
- Transaction Recording

---

## ☁️ Cloud Image Uploads

Property images are uploaded and managed using Cloudinary.

Benefits include:

- Secure Media Storage
- Fast Image Delivery
- Optimized Image Management
- Cloud-Based Hosting

---

## 🔔 Notification System

The platform automatically generates notifications throughout the booking lifecycle.

Notifications include:

- Reservation Updates
- Host Contact Information
- Property Details
- Booking Activity

---

## 📱 Responsive User Experience

The interface is optimized across devices to provide a consistent booking experience.

Supported layouts include:

- Desktop
- Laptop
- Tablet
- Mobile

---

# 🚀 Why This Project?

This Airbnb Clone was built to explore how large-scale marketplace applications are architected using modern full-stack technologies.

Rather than recreating the visual appearance alone, the project focuses on implementing the underlying business logic that powers real-world accommodation platforms, including secure authentication, relational data modeling, bookings, payments, media uploads, notifications, and responsive user experiences.

Throughout development, the project explored practical concepts such as:

- Full-stack marketplace architecture
- Prisma ORM
- PostgreSQL relational modeling
- JWT authentication
- Stripe payment processing
- Cloudinary media management
- Secure Express APIs
- Responsive React applications
- Production-ready backend security
- Cloud deployment

The result is a scalable accommodation marketplace that demonstrates both frontend craftsmanship and backend engineering.

---

# 🛠️ Tech Stack

## Frontend

| Technology | Purpose |
|------------|---------|
| React 19 | User Interface |
| React Router DOM v7 | Client-Side Routing |
| Tailwind CSS v3 | Styling |
| Lucide React | Icons |
| Vite | Development & Build Tool |

---

## Backend

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime Environment |
| Express.js 5 | REST API |
| Prisma ORM | Database Access |
| PostgreSQL | Relational Database |
| JWT | Authentication |
| bcryptjs | Password Security |
| Helmet | Security Headers |
| CORS | Cross-Origin Requests |
| Express Rate Limit | API Protection |

---

## Cloud Services

| Technology | Purpose |
|------------|---------|
| Cloudinary | Property Image Storage |
| Stripe | Payment Processing |
| Neon | PostgreSQL Database |

---

## Development Tools

- Git
- GitHub
- VS Code
- npm

---

# 🏗️ Architecture

The application follows a modern client-server architecture where the React frontend communicates with a secure Express.js API backed by Prisma ORM and PostgreSQL.

```text
                    ┌────────────────────┐
                    │       User         │
                    └─────────┬──────────┘
                              │
                              ▼
                    React + Vite Frontend
                              │
                       REST API Requests
                              │
                              ▼
                      Express.js Server
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
     JWT Authentication   Prisma ORM        Security Layer
          │                   │                   │
          └───────────────┬───┴───────────────────┘
                          ▼
                 PostgreSQL (Neon)
                          │
          ┌───────────────┼────────────────┐
          ▼               ▼                ▼
     Cloudinary       Stripe API      Notifications
```

---

## High-Level Application Flow

```text
User
   │
   ▼
Authentication
(Login / Register)
   │
   ▼
Browse Listings
   │
   ▼
Listing Details
   │
   ├──────────────┐
   ▼              ▼
Wishlist      Reviews
   │              │
   └──────┬───────┘
          ▼
     Book Property
          │
          ▼
Stripe Payment
          │
          ▼
Booking Confirmed
          │
          ▼
Notification Created
```

---

## Project Structure

```text
airbnb-clone/
│
├── server/
│   ├── config/
│   ├── middleware/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── routes/
│   ├── db.js
│   ├── index.js
│   └── package.json
│
└── client/
    ├── src/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    │
    ├── tailwind.config.js
    ├── package.json
    └── index.html
```

---

# 📸 Screenshots

> **Screenshots will be added soon.**

Recommended screenshots to include:

- 🏠 Home Page
- 🔐 Login Page
- 📝 Registration Page
- 🏡 Listing Details
- ➕ Create Listing
- ❤️ Wishlist
- 📅 Booking Page
- 💳 Stripe Checkout
- 👤 User Profile
- 📱 Mobile Responsive View

---

## 🎬 Live Demo

<p align="center">
  <img src="./assets/gifs/demo.gif"
    alt="Airbnb Clone demonstrating property browsing, secure authentication, booking management, wishlist functionality, host listings, and online payments."
    width="100%">
</p>

---

# 🌐 Live Demo

### 🚀 Frontend

**Airbnb Clone**

https://airbnb-clone-fullstack-web.vercel.app

---

### ⚙️ Backend API

https://airbnb-clone-backend-em8f.onrender.com

---

## ☁️ Cloud Infrastructure

| Service | Platform |
|---------|----------|
| Frontend | Vercel |
| Backend | Render |
| Database | Neon PostgreSQL |
| Image Storage | Cloudinary |
| Payments | Stripe |

---

> **Next:** Installation, environment variables, project setup, authentication flow, booking & payment workflow, API endpoints, deployment, and application lifecycle.


# ⚙️ Installation

Follow the steps below to run **Airbnb Clone** on your local machine.

## 📋 Prerequisites

Before getting started, make sure the following tools are installed:

- Node.js (v20 or later recommended)
- npm
- PostgreSQL
- Git
- Cloudinary Account
- Stripe Account

Verify your installation:

```bash
node -v
npm -v
git --version
psql --version
```

---

# 📥 Clone the Repository

```bash
git clone https://github.com/<your-github-username>/airbnb-clone.git
```

Navigate to the project directory:

```bash
cd airbnb-clone
```

---

# 📦 Install Dependencies

The project consists of a React frontend and an Express backend.

## Backend

```bash
cd server

npm install
```

---

## Frontend

Open another terminal.

```bash
cd client

npm install
```

---

# 🔑 Environment Variables

The application uses environment variables to securely configure the database, authentication, cloud storage, payment gateway, and client-server communication.

---

## Backend Configuration

Create a `.env` file inside the **server** directory.

```text
server/
│
├── .env
├── index.js
└── ...
```

Example configuration:

```env
PORT=5000

NODE_ENV=development

CLIENT_URL=http://localhost:5173

DATABASE_URL=postgresql://username:password@localhost:5432/airbnb_clone

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
```

---

### Backend Variables

| Variable | Description |
|----------|-------------|
| PORT | Express server port |
| NODE_ENV | Development or Production mode |
| CLIENT_URL | Allowed frontend origin(s) for CORS |
| DATABASE_URL | PostgreSQL database connection string |
| JWT_SECRET | Secret used to sign JWT tokens |
| CLOUDINARY_CLOUD_NAME | Cloudinary cloud name |
| CLOUDINARY_API_KEY | Cloudinary API key |
| CLOUDINARY_API_SECRET | Cloudinary API secret |
| STRIPE_SECRET_KEY | Stripe secret key |

---

## Frontend Configuration

Create a `.env` file inside the **client** directory.

```text
client/
│
├── .env
└── src/
```

Local development:

```env
VITE_API_URL=http://localhost:5000
```

Production:

```env
VITE_API_URL=https://airbnb-clone-backend-em8f.onrender.com
```

---

### Frontend Variables

| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |

---

> **Important:** Never commit `.env` files or secret credentials to version control.

---

# ▶️ Running the Application

## Step 1 — Start PostgreSQL

Ensure your PostgreSQL database is running.

---

## Step 2 — Apply Prisma Migrations

Inside the server directory:

```bash
npx prisma migrate dev
```

Generate the Prisma Client:

```bash
npx prisma generate
```

---

## Step 3 — Start the Backend

```bash
cd server

npm run dev
```

or

```bash
npm start
```

Backend runs on:

```text
http://localhost:5000
```

---

## Step 4 — Start the Frontend

Open another terminal.

```bash
cd client

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

---

# 🚀 Application Workflow

The following diagram illustrates the overall user journey.

```text
Launch Application
        │
        ▼
Authentication
(Login / Register)
        │
        ▼
Browse Listings
        │
        ▼
Listing Details
        │
        ▼
Wishlist / Booking
        │
        ▼
Stripe Checkout
        │
        ▼
Booking Confirmation
        │
        ▼
Notification Generated
```

---

# 🔐 Authentication Flow

Authentication is powered by **JWT (JSON Web Tokens)** together with **bcryptjs** password hashing.

---

## User Registration

1. User creates an account.
2. Password is hashed using bcryptjs.
3. User record is stored in PostgreSQL.
4. Registration completes successfully.

---

## User Login

1. User submits email and password.
2. Credentials are validated.
3. JWT token is generated.
4. Token is returned to the client.
5. Token is stored locally.
6. Protected pages become accessible.

---

## Protected Routes

Authenticated requests include:

```http
Authorization: Bearer <JWT_TOKEN>
```

The authentication middleware verifies every incoming request before allowing access.

Protected functionality includes:

- Creating listings
- Editing listings
- Booking properties
- Wishlist management
- Reviews
- Notifications
- Profile management

---

## Authentication Lifecycle

```text
Register
     │
     ▼
Password Hashing
     │
     ▼
PostgreSQL
     │
     ▼
Login
     │
     ▼
JWT Generated
     │
     ▼
Local Storage
     │
     ▼
Protected API Requests
```

---

# 🏡 Marketplace Workflow

The platform supports two primary user roles.

## 👤 Guest

Guests can:

- Browse listings
- Search accommodations
- View listing details
- Save wishlists
- Book properties
- Complete Stripe payments
- Manage trips
- Leave reviews

---

## 🏠 Host

Hosts can:

- Create listings
- Upload images
- Edit properties
- Manage accommodations
- Receive bookings
- View reservations

---

# 📅 Booking Workflow

Booking follows a secure multi-step process.

```text
Choose Listing
       │
       ▼
Select Dates
       │
       ▼
Calculate Total Cost
       │
       ▼
Stripe Payment
       │
       ▼
Booking Created
       │
       ▼
Notification Generated
```

---

# 💳 Payment Workflow

Stripe securely processes reservation payments.

```text
Guest
   │
   ▼
Booking Request
   │
   ▼
Express API
   │
   ▼
Stripe Payment Intent
   │
   ▼
Payment Processing
   │
   ▼
Booking Confirmation
   │
   ▼
Database Update
```

---

# ☁️ Image Upload Workflow

Property images are managed through Cloudinary.

```text
Host Uploads Images
        │
        ▼
Cloudinary
        │
        ▼
Secure Image URL
        │
        ▼
Prisma Database
        │
        ▼
Property Listing
```

---

# ❤️ Wishlist Workflow

Wishlist interactions are optimized for a smooth user experience.

```text
Click Heart Icon
        │
        ▼
PATCH Request
        │
        ▼
Update Wishlist
        │
        ▼
React Context Updated
        │
        ▼
UI Refresh (No Reload)
```

---

# 📡 REST API Overview

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new account |
| POST | `/api/auth/login` | Authenticate user |

---

## Users

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/profile` | Retrieve current user profile |
| PATCH | `/api/users/:id/wishlist` | Update user wishlist |

---

## Listings

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/listings` | Retrieve listings |
| GET | `/api/listings/:id` | Retrieve listing details |
| POST | `/api/listings` | Create listing |
| PUT | `/api/listings/:id` | Update listing |
| DELETE | `/api/listings/:id` | Delete listing |

---

## Bookings

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/bookings` | Create booking |
| GET | `/api/bookings` | Retrieve bookings |
| DELETE | `/api/bookings/:id` | Cancel booking |

---

## Reviews

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/reviews` | Create review |
| GET | `/api/reviews/:listingId` | Retrieve listing reviews |

---

## Notifications

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/notifications` | Retrieve notifications |

---

## Payments

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/payments/create-payment-intent` *(or equivalent implementation)* | Initialize Stripe payment |

> *The payment endpoint name may differ depending on your implementation.*

---

# 🔄 Data Flow

```text
React Components
        │
        ▼
REST API Requests
        │
        ▼
Express Server
        │
        ▼
Authentication Middleware
        │
        ▼
Prisma ORM
        │
        ▼
PostgreSQL (Neon)
        │
        ▼
Updated Response
        │
        ▼
React State
        │
        ▼
UI Re-render
```

---

# ☁️ Deployment

Airbnb Clone is fully deployed using a cloud-native architecture.

## Frontend

**Platform**

- Vercel

**Live URL**

```text
https://airbnb-clone-fullstack-web.vercel.app
```

---

## Backend

**Platform**

- Render

**API URL**

```text
https://airbnb-clone-backend-em8f.onrender.com
```

---

## Database

**Development**

- Local PostgreSQL

**Production**

- Neon PostgreSQL

---

## Additional Services

| Service | Purpose |
|---------|----------|
| Cloudinary | Property image storage |
| Stripe | Secure payment processing |

---

# 🌍 Production Architecture

```text
                     Users
                       │
                       ▼
               Vercel Frontend
                       │
                       ▼
              Render Express API
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Prisma ORM     Cloudinary      Stripe
        │
        ▼
 Neon PostgreSQL
```

---

# 🔒 Security Highlights

Several production-oriented security measures are incorporated throughout the application.

- JWT-secured authentication
- Password hashing using bcryptjs
- Helmet security headers
- Environment-aware rate limiting
- Protected API routes
- Configurable CORS policies
- Prisma parameterized queries
- Secure Cloudinary uploads
- Stripe-hosted payment processing
- Cascade deletion for relational integrity
- Environment variable isolation

---

# 🌐 Browser Compatibility

The application supports all major modern browsers.

- ✅ Google Chrome
- ✅ Microsoft Edge
- ✅ Mozilla Firefox
- ✅ Brave
- ✅ Opera
- ✅ Safari

---

# 📱 Responsive Design

Airbnb Clone is fully responsive and optimized for:

- Desktop
- Laptop
- Tablet
- Mobile

Tailwind CSS enables adaptive layouts that provide a consistent experience across a wide range of devices.

---

> **Next:** UI highlights, marketplace experience, security architecture, technical implementation, future roadmap, contributing, license, acknowledgements, and project footer.


# 🎨 User Interface Highlights

Airbnb Clone is designed to provide a clean, modern, and intuitive booking experience inspired by contemporary accommodation marketplaces. The interface focuses on usability, responsive layouts, and seamless navigation while maintaining a lightweight and performant frontend.

---

## 🏡 Modern Marketplace Experience

The application provides a familiar browsing experience where users can quickly discover accommodations through organized listing cards and intuitive navigation.

Highlights include:

- Clean landing page
- Responsive property grid
- Modern navigation bar
- Attractive listing cards
- Consistent spacing and typography
- Optimized visual hierarchy

---

## 🔍 Property Discovery

Finding accommodations is simple and intuitive.

Each property card presents essential information including:

- Property image
- Property title
- Location
- Price per night
- Property type
- Guest capacity
- Wishlist status

This enables users to compare listings without opening every property page.

---

## 📄 Listing Details

Each listing includes a comprehensive overview designed to help guests make informed booking decisions.

Information includes:

- Image gallery
- Property description
- Amenities
- Pricing breakdown
- Host information
- Reviews
- Reservation details

---

## ❤️ Wishlist Experience

The wishlist system is designed to feel fast and responsive.

Features include:

- One-click wishlist toggle
- Instant UI updates
- Persistent saved properties
- No page refresh required

The application updates local state immediately after successful requests, creating a smooth user experience.

---

## 🏠 Host Dashboard

Hosts can manage their accommodations through a dedicated listing management workflow.

Supported actions include:

- Create listings
- Edit listings
- Upload images
- Update pricing
- Manage amenities
- View bookings

---

## 📅 Booking Experience

The booking interface guides users through a straightforward reservation process.

Workflow includes:

- Selecting travel dates
- Viewing pricing
- Confirming reservation
- Secure payment
- Booking confirmation

---

## 📱 Responsive Design

The platform is fully responsive across multiple devices.

Supported layouts include:

- 💻 Desktop
- 🖥️ Laptop
- 📱 Mobile
- 📟 Tablet

Tailwind CSS enables adaptive layouts that provide a consistent experience across different screen sizes.

---

# ⚡ Performance Highlights

Several implementation decisions improve responsiveness and scalability.

Performance optimizations include:

- React component architecture
- Vite-powered development
- Optimized React Context updates
- Prisma query optimization
- Indexed PostgreSQL lookups
- Cloudinary image delivery
- Lazy route rendering
- Efficient REST API communication

---

# 🏪 Marketplace Workflow

Airbnb Clone simulates the lifecycle of a modern accommodation marketplace.

---

## 👤 Guest Journey

```text
Register / Login
        │
        ▼
Browse Listings
        │
        ▼
Open Property
        │
        ▼
Save Wishlist
        │
        ▼
Book Property
        │
        ▼
Stripe Payment
        │
        ▼
Booking Confirmed
        │
        ▼
View Upcoming Trips
```

---

## 🏠 Host Journey

```text
Register
      │
      ▼
Create Listing
      │
      ▼
Upload Images
      │
      ▼
Publish Listing
      │
      ▼
Receive Bookings
      │
      ▼
Manage Reservations
```

---

## 🔔 Notification Workflow

After every successful reservation:

```text
Booking Created
       │
       ▼
Notification Generated
       │
       ▼
Guest Dashboard
       │
       ▼
Host Contact Available
```

This allows guests to quickly access booking-related information and host contact details.

---

# 🛡️ Security Features

Security has been integrated throughout the application to reflect production-oriented backend practices.

---

## 🔐 Authentication

Authentication is secured using:

- JWT Authentication
- bcryptjs password hashing
- Protected API routes
- Secure authorization middleware

---

## 🌐 HTTP Security

The Express server includes multiple layers of protection.

Implemented measures include:

- Helmet security headers
- Removal of Express fingerprint (`x-powered-by`)
- Configurable CORS policies
- Trusted proxy configuration

---

## 🚦 API Rate Limiting

Environment-aware rate limiting helps protect the application from abuse.

### Development

- Higher request threshold for local development

### Production

- Strict request limits
- Improved protection against automated abuse
- Reduced risk of denial-of-service attacks

---

## 💳 Secure Payments

Stripe handles all payment processing.

Benefits include:

- Secure checkout
- Trusted payment gateway
- PCI-compliant payment handling
- Transaction verification

Sensitive payment information is never processed directly by the application.

---

## 🗄️ Database Integrity

Prisma and PostgreSQL enforce strong relational consistency.

Highlights include:

- Foreign key relationships
- Cascade deletion
- Indexed queries
- Unique constraints
- Type-safe ORM operations

---

## ☁️ Secure Media Storage

Property images are uploaded through Cloudinary.

Benefits include:

- Secure uploads
- Optimized image delivery
- Cloud-hosted storage
- Efficient media management

---

# 🧠 Technical Highlights

This project combines multiple modern web development technologies into a production-style marketplace.

### Frontend

- React 19
- React Router DOM v7
- Tailwind CSS
- Context API
- Responsive layouts
- Component-driven architecture

---

### Backend

- Express.js 5
- Prisma ORM
- JWT Authentication
- bcryptjs
- Helmet
- Rate Limiting
- REST APIs

---

### Database

- PostgreSQL
- Prisma ORM
- Relational schema design
- Indexed queries
- Cascade deletion
- Strong data integrity

---

### Cloud Services

- Neon PostgreSQL
- Cloudinary
- Stripe
- Render
- Vercel

---

# 📚 Learning Outcomes

Airbnb Clone was developed as a practical project to explore the architecture behind modern accommodation marketplaces.

Key concepts explored include:

- Full-stack marketplace development
- REST API design
- JWT authentication
- Secure password storage
- Prisma ORM
- Relational database modeling
- Stripe payment integration
- Cloudinary image management
- Responsive UI development
- Production-ready backend security
- Cloud deployment workflows

This project demonstrates how multiple technologies work together to deliver a scalable and secure booking platform.

---

# 🚀 Future Improvements

While the application already offers a complete booking experience, several enhancements are planned for future versions.

## Planned Features

- Interactive maps
- Location-based search
- Advanced property filters
- Availability calendar
- Real-time messaging
- Booking cancellation workflow
- Refund management
- Host analytics dashboard
- Guest verification
- Multi-language support
- Dark mode
- Push notifications
- Email notifications
- Saved searches
- Property recommendations
- AI-powered search
- Recently viewed listings
- Admin dashboard
- Docker support
- Automated CI/CD pipeline

---

# 🤝 Contributing

Contributions, ideas, and improvements are always welcome.

If you'd like to contribute:

---

## 1️⃣ Fork the Repository

Create your own copy of the project.

---

## 2️⃣ Clone Your Fork

```bash
git clone https://github.com/your-username/airbnb-clone.git
```

---

## 3️⃣ Create a Feature Branch

```bash
git checkout -b feature/amazing-feature
```

---

## 4️⃣ Make Your Changes

Implement your feature or bug fix.

---

## 5️⃣ Commit Your Changes

```bash
git commit -m "Add amazing feature"
```

---

## 6️⃣ Push Your Branch

```bash
git push origin feature/amazing-feature
```

---

## 7️⃣ Open a Pull Request

Submit a Pull Request describing your changes.

---

# 🐛 Found a Bug?

Bug reports and feature suggestions are always appreciated.

Helpful reports include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Browser information
- Screenshots (if applicable)

---

# ⭐ Support the Project

If you enjoyed exploring this project, consider giving it a ⭐ on GitHub.

Your support helps others discover the project and encourages future improvements.

---

# 📄 License

This project is released under the **MIT License**.

You are free to:

- Use
- Modify
- Learn from
- Share
- Build upon

while preserving the original license.

> **Note:** If you haven't added a `LICENSE` file to the repository yet, GitHub provides an MIT License template that you can add in just a few clicks.

---

# 🙏 Acknowledgements

A sincere thank you to the open-source community and the technologies that made this project possible.

Special thanks to:

- React
- Vite
- Express.js
- Prisma ORM
- PostgreSQL
- Neon
- Tailwind CSS
- Cloudinary
- Stripe
- JWT
- bcryptjs
- Helmet
- Render
- Vercel
- Git
- GitHub

Their tools, documentation, and communities made building this project possible.

---

# 📌 Project Status

> **Current Status:** Active

Airbnb Clone is fully functional, deployed, and continuously maintained.

This project was built to better understand how production-grade marketplace platforms are designed and engineered—from authentication and secure APIs to relational databases, payments, media management, and scalable cloud deployments.

As I continue learning, I plan to extend the platform with additional marketplace features, improved user experiences, and more advanced search and booking capabilities.

---

# 💡 Final Thoughts

Building Airbnb Clone has been an excellent opportunity to explore the complete lifecycle of a modern full-stack marketplace application.

From designing relational database models with Prisma to integrating Stripe payments, Cloudinary media uploads, and secure Express APIs, every feature contributed to a deeper understanding of scalable software architecture and real-world application development.

This project represents another important milestone in my journey toward building secure, production-ready web applications.

---

<div align="center">

# 🏡 Find. Book. Stay.

Thank you for exploring **Airbnb Clone**.

If you found this project interesting, consider giving the repository a ⭐ to support its continued development.

**Happy Coding! 🚀**

</div>
````



