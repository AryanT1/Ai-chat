# AI-ChatBot Backend 🚀

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white )](https://www.typescriptlang.org/ )
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white )](https://nodejs.org/ )
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white )](https://expressjs.com/ )
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white )](https://www.prisma.io/ )
[![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white )](https://redis.io/ )
[![Stripe](https://img.shields.io/badge/Stripe-626CD9?style=for-the-badge&logo=stripe&logoColor=white )](https://stripe.com/ )
[![OpenRouter](https://img.shields.io/badge/AI%20Model-GPT--4o--mini-000000?style=for-the-badge&logo=openai&logoColor=white )](https://openrouter.ai/ )

**AI-ChatBot** is a production-ready, monetized backend API for a modern AI chat platform. It is built with a robust **TypeScript** and **Node.js** stack, providing secure user authentication, seamless payment integration, and intelligent rate-limiting for a freemium model.

## ✨ Features

This API powers a comprehensive chat application with the following core functionalities:

*   **Intelligent AI Chat:** Real-time conversational interface powered by **GPT-4o-mini** via the **OpenRouter** API.
*   **Contextual File Uploads:** Supports file uploads (up to 5MB) to provide the AI with enhanced context for more accurate and relevant responses.
*   **Secure User Authentication:** Implements a robust signup/login system using **JWT (JSON Web Tokens)** stored in HTTP-only cookies and **bcrypt** for password hashing.
*   **Freemium Monetization:** Enforces a daily chat limit (10 chats/day) for free users, encouraging upgrades to Pro plans.
*   **Stripe Integration:** Seamless payment processing for Pro subscriptions (Monthly/Yearly) using **Stripe**.
*   **High-Performance Caching:** Utilizes **Redis** for fast user profile lookups and efficient rate-limiting.
*   **Persistent Data:** Stores user data and chat history using **Prisma** with a **PostgreSQL** database.

## 🛠️ Tech Stack

The project is built on a modern, scalable technology stack:

| Category | Technology | Details |
| :--- | :--- | :--- |
| **Backend** | Node.js, Express 5 | Core runtime and web framework. |
| **Language** | TypeScript | Ensures type safety and better maintainability. |
| **Database** | PostgreSQL | Primary data store for users and chat history. |
| **ORM** | Prisma | Next-generation ORM for type-safe database access. |
| **Caching** | Redis (ioredis) | Used for rate limiting and user profile caching. |
| **AI Service** | OpenRouter | Unified API for LLMs, specifically using `GPT-4o-mini`. |
| **Payments** | Stripe v20 | Payment processing for subscription plans. |
| **Validation** | Zod v4 | Schema validation for API request bodies. |
| **Auth** | JWT, bcrypt | Token-based authentication and password hashing. |
| **Dev Tools** | tsx, nodemon | TypeScript execution and live-reloading for development. |

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
    ```bash
    git clone https://github.com/AryanT1/Ai-chat.git
    cd Ai-chat
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**
    Create a `.env` file in the root directory and populate it with your credentials:

    ```
    # Server Configuration
    PORT=3000
    JWT_SECRET="YOUR_VERY_STRONG_SECRET_KEY"

    # Database (PostgreSQL )
    DATABASE_URL="postgresql://user:password@host:port/database_name"

    # Redis
    REDIS_URL="redis://localhost:6379" # Default for local setup

    # AI Service (OpenRouter)
    API_KEY="YOUR_OPENROUTER_API_KEY"

    # Stripe Payment Gateway
    STRIPE_SECRET_KEY="sk_test_..."
    STRIPE_PUBLISHABLE_KEY="pk_test_..."
    ```

4.  **Database Setup:**
    Apply the Prisma schema to your PostgreSQL database:

    ```bash
    npx prisma migrate dev --name init
    ```

### Running the Application

*   **Development Mode (with live reload):**
    ```bash
    npm run dev
    ```
    The server will start on the port specified in your `.env` file (default: `http://localhost:3000` ).

*   **Production Build:**
    ```bash
    npm run build
    npm start
    ```

## 🗺️ API Endpoints

The API is versioned under `/api/v1/`.

| Feature | Method | Endpoint | Description | Middleware |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `POST` | `/Register/signup` | Register a new user. | None |
| **Auth** | `POST` | `/Register/login` | Log in a user and set JWT cookie. | None |
| **Auth** | `GET` | `/Register/me` | Get authenticated user details and chat count. | `GeneralAuth` |
| **Chat** | `POST` | `/chat/chat` | Send a message to the AI (supports file upload). | `GeneralAuth`, `rateLimit` |
| **Payment** | `GET` | `/payment/plans` | Get a list of available subscription plans. | None |
| **Payment** | `POST` | `/payment/create-order` | Create a Stripe Payment Intent. | `GeneralAuth` |
| **Payment** | `POST` | `/payment/verify` | Verify a successful Stripe payment. | `GeneralAuth` |
| **Payment** | `GET` | `/payment/subscription` | Check the user's current subscription status. | `GeneralAuth` |

----