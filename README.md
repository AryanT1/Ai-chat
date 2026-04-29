# AI Chat Platform 🚀

**AI Chat Platform** is a full-stack application that provides a modern, monetized AI chat experience. It combines a responsive and interactive frontend with a robust, scalable backend, offering features like AI-powered conversations, secure user authentication, and subscription management.

## ✨ Features

### Frontend
*   **Intuitive User Interface:** Built with **React** and **TypeScript** for a dynamic and responsive user experience.
*   **Modular Component Architecture:** Organized into `pages`, `components`, and `context` for maintainability and scalability.
*   **Authentication Flows:** Dedicated pages for user `Login` and `Signup`.
*   **Interactive Chat Dashboard:** A `ChatDashboard` for real-time AI conversations.
*   **Informative Pages:** `LandingPage` and `Pricing` pages to showcase features and subscription options.

### Backend
*   **Intelligent AI Chat:** Real-time conversational interface powered by **GPT-4o-mini** via the **OpenRouter** API.
*   **Contextual File Uploads:** Supports file uploads to provide the AI with enhanced context for more accurate and relevant responses.
*   **Secure User Authentication:** Implements a robust signup/login system using **JWT (JSON Web Tokens)** stored in HTTP-only cookies and **bcrypt** for password hashing.
*   **Freemium Monetization:** Enforces a daily chat limit for free users, encouraging upgrades to Pro plans.
*   **Stripe Integration:** Seamless payment processing for Pro subscriptions (Monthly/Yearly) using **Stripe**.
*   **High-Performance Caching:** Utilizes **Redis** for fast user profile lookups and efficient rate-limiting.
*   **Persistent Data:** Stores user data and chat history using **Prisma** with a **PostgreSQL** database.

## 🛠️ Tech Stack

The project is built on a modern, scalable technology stack:

| Category | Technology | Details |
| :-- | :-- | :-- |
| **Frontend** | React, TypeScript, Vite | Core UI library, type safety, and fast build tool. |
| **Styling** | Tailwind CSS | Utility-first CSS framework for rapid UI development. |
| **Backend** | Node.js, Express 5 | Core runtime and web framework. |
| **Language** | TypeScript | Ensures type safety and better maintainability across the stack. |
| **Database** | PostgreSQL | Primary data store for users and chat history. |
| **ORM** | Prisma | Next-generation ORM for type-safe database access. |
| **Caching** | Redis (ioredis) | Used for rate limiting and user profile caching. |
| **AI Service** | OpenRouter | Unified API for LLMs, specifically using `GPT-4o-mini`. |
| **Payments** | Stripe v20 | Payment processing for subscription plans. |
| **Validation** | Zod v4 | Schema validation for API request bodies. |
| **Auth** | JWT, bcrypt | Token-based authentication and password hashing. |
| **Deployment** | AWS (EC2) | Cloud platform for hosting the backend service. |
| **Dev Tools** | tsx, nodemon | TypeScript execution and live-reloading for backend development. |

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL database instance
*   Redis instance
*   OpenRouter API Key
*   Stripe Secret Key and Publishable Key

### Installation

1.  **Clone the repository:**
    ```shell
    git clone https://github.com/AryanT1/Ai-chat.git
    cd Ai-chat
    ```

2.  **Install Backend dependencies:**
    ```shell
    npm install
    ```

3.  **Install Frontend dependencies:**
    ```shell
    cd frontend
    npm install
    cd ..
    ```

4.  **Set up Environment Variables:** Create a `.env` file in the root directory (for backend ) and populate it with your credentials:
    ```env
    # Server Configuration
    PORT=3000
    JWT_SECRET="YOUR_VERY_STRONG_SECRET_KEY"
    
    # Database (PostgreSQL)
    DATABASE_URL="postgresql://user:password@host:port/database_name"
    
    # Redis
    REDIS_URL="redis://localhost:6379"
    
    # AI Service (OpenRouter)
    API_KEY="YOUR_OPENROUTER_API_KEY"
    
    # Stripe Payment Gateway
    STRIPE_SECRET_KEY="sk_test_..."
    STRIPE_PUBLISHABLE_KEY="pk_test_..."
    ```

5.  **Database Setup:** Apply the Prisma schema to your PostgreSQL database:
    ```shell
    npx prisma migrate dev --name init
    ```

### Running the Application

*   **Start Backend (Development Mode):**
    ```shell
    npm run dev
    ```
    The backend server will start on `http://localhost:3000`.

*   **Start Frontend (Development Mode ):**
    ```shell
    cd frontend
    npm run dev
    ```
    The frontend application will typically start on `http://localhost:5173`.

## 🗺️ API Endpoints

The API is versioned under `/api/v1/`.

| Feature | Method | Endpoint | Description |
| :-- | :-- | :-- | :-- |
| **Auth** | `POST` | `/Register/signup` | Register a new user. |
| **Auth** | `POST` | `/Register/login` | Log in a user and set JWT cookie. |
| **Auth** | `GET` | `/Register/me` | Get authenticated user details. |
| **Chat** | `POST` | `/chat/chat` | Send a message to the AI. |
| **Payment** | `GET` | `/payment/plans` | Get available subscription plans. |
| **Payment** | `POST` | `/payment/create-order` | Create a Stripe Payment Intent. |
| **Payment** | `POST` | `/payment/verify` | Verify a successful Stripe payment. |
| **Payment** | `GET` | `/payment/subscription` | Check subscription status. |
