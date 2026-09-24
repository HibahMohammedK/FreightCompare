# 🚚 FreightCompare

> **AI-powered freight comparison and logistics management platform**

FreightCompare is a full-stack logistics platform that helps customers discover and compare freight transport options, manage saved routes and price alerts, communicate with support staff in real time, and access AI-assisted transport research.

The platform provides dedicated workflows for **Customers, Support Staff, and Administrators**, with role-based access control, subscription management, real-time communication, AI integration, and containerized deployment.

### 🌐 Live Demo

**[freightcompare.online](https://freightcompare.online)**

### 💻 Source Code

**[GitHub Repository](https://github.com/HibahMohammedK/FreightCompare)**

---

## 📌 Project Overview

FreightCompare was built as a production-oriented full-stack application to explore how a logistics platform can combine:

* Freight comparison and transport search
* AI-assisted logistics research
* Real-time customer support
* Subscription-based feature access
* Price tracking and alerts
* Role-based administration
* RESTful API architecture
* WebSocket-based communication
* Containerized deployment
* CI automation

The application follows a separation of concerns between the frontend, backend API, database, caching layer, and real-time communication infrastructure.

---

## ✨ Key Features

### 👤 Customer

Customers can:

* Search and compare freight transport options
* Filter transport options by route and transport type
* View transport pricing and duration
* Save transport options
* View search history
* Create and manage price alerts
* Receive real-time notifications
* Register and authenticate using email/password
* Authenticate using Google
* Verify their email through OTP
* Manage their profile
* Change and reset passwords
* Subscribe to premium plans
* View subscription history
* Cancel subscriptions
* Use the AI Transport Assistant
* Create customer support tickets
* Communicate with support staff through real-time chat
* Track ticket status and updates

---

### 👨‍💼 Administrator

Administrators can:

* Access the administration dashboard
* Manage transport records
* Add and update transport information
* Upload transport data through CSV
* Manage freight companies
* Activate and deactivate companies
* Manage customers
* Manage support staff
* Manage subscription plans
* Monitor customer subscriptions
* Manage support tickets
* Assign and reassign tickets
* Monitor staff availability
* Use the AI Transport Assistant
* Receive real-time administrative notifications

---

### 👨‍💻 Support Staff

Support staff can:

* Access the staff dashboard
* View assigned support tickets
* Update ticket status
* Communicate with customers
* Receive real-time notifications
* Participate in customer support conversations
* Maintain availability status
* Receive automatically assigned tickets

---

# 🤖 AI Transport Assistant

FreightCompare integrates **Tavily Search API** and **Groq LLM** to provide AI-assisted transport research.

The AI workflow can assist with:

* Freight recommendations
* Web-based transport research
* Transport information extraction
* Company extraction
* Price extraction
* Duration extraction
* Transport type identification
* Confidence scoring
* AI-assisted transport creation

### AI Flow

```text
User Requirements
       │
       ▼
Tavily Search API
       │
       ▼
Web Search Results
       │
       ▼
Groq LLM
       │
       ▼
Information Processing
       │
       ├── Transport
       ├── Company
       ├── Price
       ├── Duration
       └── Transport Type
       │
       ▼
Processed Transport Information
```

---

# 🔔 Real-Time Communication

FreightCompare uses **Django Channels, Redis, WebSockets, and Daphne** to support real-time application features.

Real-time functionality includes:

* Notifications
* Ticket updates
* Ticket assignment updates
* Ticket status changes
* Customer support chat
* Message delivery
* Message read status
* Staff presence
* Online/offline availability
* Route-match notifications
* Price-alert notifications

### WebSocket Architecture

```text
React Client
     │
     │ WebSocket
     ▼
Django Channels
     │
     ▼
Redis Channel Layer
     │
     ├── Notifications
     ├── Ticket Events
     ├── Chat Messages
     └── Presence Updates
```

---

# 💬 Customer Support System

FreightCompare includes an integrated support-ticket and real-time communication system.

### Support Workflow

```text
Customer
   │
   ▼
Create Support Ticket
   │
   ▼
Automatic Staff Assignment
   │
   ▼
Real-Time Notification
   │
   ▼
Staff ↔ Customer Chat
   │
   ▼
Ticket Status Updates
   │
   ▼
Resolution
```

Ticket assignment uses **workload balancing and round-robin selection**.

### Ticket Statuses

* Open
* Assigned
* In Progress
* Resolved
* Closed

Administrators can monitor tickets and reassign them when required.

---

# 💳 Subscription System

FreightCompare includes subscription-based feature access using **Stripe**.

Subscription functionality includes:

* Monthly billing
* Yearly billing
* Feature-based access
* Usage limits
* Premium functionality
* Subscription history
* Subscription cancellation
* Stripe integration

Application capabilities can be controlled according to subscription-plan permissions and usage limits.

---

# 🔐 Authentication & Authorization

FreightCompare implements multiple authentication and account-management mechanisms.

### Authentication

* JWT authentication
* Google OAuth
* Email verification
* OTP verification
* Password reset
* Password change
* Forced password change for staff accounts

### Authorization

The application uses **Role-Based Access Control (RBAC)**.

Supported roles:

```text
Customer
Staff
Administrator
```

Different roles receive access to different workflows and application resources.

---

# 🏗️ Application Architecture

The application follows a modern full-stack architecture:

```text
                         ┌───────────────────┐
                         │    React Client   │
                         │ TypeScript / Vite │
                         └─────────┬─────────┘
                                   │
                         REST API / WebSocket
                                   │
                                   ▼
                         ┌───────────────────┐
                         │  Django / DRF     │
                         │   Backend API     │
                         └───────┬───────────┘
                                 │
              ┌──────────────────┼──────────────────┐
              │                  │                  │
              ▼                  ▼                  ▼
       ┌────────────┐     ┌────────────┐     ┌─────────────┐
       │ PostgreSQL │     │   Redis    │     │ External    │
       │  Database  │     │ Cache / RT │     │ Services    │
       └────────────┘     └────────────┘     └─────────────┘
                                                  │
                              ┌───────────────────┼───────────────────┐
                              │                   │                   │
                              ▼                   ▼                   ▼
                         Tavily API          Groq LLM            Stripe
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript
* Redux Toolkit
* Tailwind CSS
* React Router
* Axios
* Vite

## Backend

* Python
* Django
* Django REST Framework
* Django ORM
* JWT Authentication
* Google OAuth

## Database & Caching

* PostgreSQL
* Redis

## Real-Time

* Django Channels
* WebSockets
* Daphne

## AI & External Integrations

* Groq LLM
* Tavily Search API
* Stripe
* Google OAuth

## DevOps & Deployment

* Docker
* Docker Compose
* AWS EC2
* Git
* GitHub
* GitHub Actions
* CI/CD

---

# 📦 Project Structure

```text
FreightCompare/
│
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── apps/
│   └── ...
│
├── frontend/
│   ├── src/
│   ├── package.json
│   └── ...
│
├── docker-compose.yml
├── Dockerfile
└── README.md
```

> The exact internal structure may evolve as the application is maintained.

---

# 🔐 Environment Configuration

FreightCompare uses environment variables for application configuration, database connectivity, authentication, third-party services, AI integrations, payments, and email services.

### Backend

Create:

```text
backend/.env
```

Example configuration:

```env
SECRET_KEY=
DEBUG=

DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=

TAVILY_API_KEY=
GROQ_API_KEY=

STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

EMAIL_HOST=
EMAIL_PORT=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=
DEFAULT_FROM_EMAIL=
```

### Frontend

Create:

```text
frontend/.env
```

Example:

```env
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=
```

### ⚠️ Security

**Never commit secrets to GitHub.**

Do not commit:

* `.env` files
* API keys
* Passwords
* Django secret keys
* Stripe secrets
* OAuth secrets
* Database credentials
* Email credentials

---

# 🚀 Running Locally

## Prerequisites

Make sure you have:

* Git
* Docker
* Docker Compose

For development without Docker:

* Node.js
* npm
* Python
* PostgreSQL
* Redis

---

## 1. Clone the Repository

```bash
git clone https://github.com/HibahMohammedK/FreightCompare.git

cd FreightCompare
```

---

## 2. Configure Environment Variables

Create:

```text
backend/.env
frontend/.env
```

Configure the required environment variables for your development environment.

Do not commit these files.

---

## 3. Start the Application

Using Docker Compose:

```bash
docker compose up --build
```

Or run in detached mode:

```bash
docker compose up --build -d
```

---

## 4. Access the Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:8000
```

---

## 5. Apply Database Migrations

If migrations need to be applied manually:

```bash
docker compose exec backend python manage.py migrate
```

---

## 6. Create an Administrator

Create a Django superuser with:

```bash
docker compose exec backend python manage.py createsuperuser
```

Follow the prompts in the terminal.

---

# 🧪 Testing

Testing covers the major application workflows, including:

* Backend API testing
* Serializer validation
* Authentication
* Permission testing
* Transport management
* Price alerts
* Subscription functionality
* Ticket management
* Real-time chat
* WebSocket functionality
* Notifications
* Frontend functionality
* Integration testing
* Regression testing

---

# 🔄 CI/CD

FreightCompare uses **GitHub Actions** to automate application build and deployment workflows.

The deployment workflow is designed around:

```text
Git Push
   │
   ▼
GitHub Actions
   │
   ├── Validate application
   ├── Run configured checks
   ├── Build frontend
   ├── Build Docker images
   └── Deploy
        │
        ▼
     AWS EC2
```

This provides a repeatable deployment workflow and reduces manual deployment steps.

---

# ☁️ Production Deployment

FreightCompare is deployed as a containerized application using:

* AWS EC2
* Docker
* Docker Compose
* GitHub Actions
* PostgreSQL
* Redis
* Django
* React

### Production Application

🌐 **https://freightcompare.online**

The production deployment provides access to the application's customer-facing workflows and demonstrates the project running in a real hosting environment.

---

# 📸 Application Screenshots

Screenshots can be added here to demonstrate the main application workflows.

## Landing Page

<!-- Add screenshot -->

## Customer Dashboard

<!-- Add screenshot -->

## Transport Search & Comparison

<!-- Add screenshot -->

## Search Results

<!-- Add screenshot -->

## Price Alerts

<!-- Add screenshot -->

## AI Transport Assistant

<!-- Add screenshot -->

## Real-Time Notifications

<!-- Add screenshot -->

## Customer Support Chat

<!-- Add screenshot -->

## Admin Dashboard

<!-- Add screenshot -->

## Transport Management

<!-- Add screenshot -->

## CSV Transport Upload

<!-- Add screenshot -->

## Subscription Management

<!-- Add screenshot -->

---

# 📋 Application Modules

| Module                      | Status        |
| --------------------------- | ------------- |
| Authentication              | ✅ Complete    |
| Google Authentication       | ✅ Complete    |
| Email Verification          | ✅ Complete    |
| Password Reset              | ✅ Complete    |
| Customer Dashboard          | ✅ Complete    |
| Transport Comparison        | ✅ Complete    |
| Transport Management        | ✅ Complete    |
| Saved Transports            | ✅ Complete    |
| Search History              | ✅ Complete    |
| Price Alerts                | ✅ Complete    |
| Real-Time Notifications     | ✅ Complete    |
| AI Transport Assistant      | ✅ Complete    |
| Company Management          | ✅ Complete    |
| Customer Management         | ✅ Complete    |
| Staff Management            | ✅ Complete    |
| Subscription Management     | ✅ Complete    |
| Stripe Integration          | ✅ Complete    |
| CSV Transport Upload        | ✅ Complete    |
| Customer Support            | ✅ Complete    |
| Real-Time Chat              | ✅ Complete    |
| Ticket Management           | ✅ Complete    |
| Automatic Ticket Assignment | ✅ Complete    |
| Staff Presence              | ✅ Complete    |
| Dockerized Development      | ✅ Complete    |
| AWS Deployment              | ✅ Complete    |
| CI/CD                       | ✅ Implemented |

---

# 🎯 Project Goals

FreightCompare was developed to demonstrate how modern full-stack technologies can be combined to build a practical logistics platform.

The project focuses on:

* Freight transport comparison
* AI-assisted logistics research
* Transport data management
* Real-time customer support
* Real-time notifications
* Subscription-based functionality
* Role-based application architecture
* REST API development
* WebSocket communication
* Scalable backend services
* Containerized development and deployment
* Cloud deployment
* CI/CD automation
* Practical AI integration

---

# 📚 Engineering Concepts Demonstrated

This project provided hands-on implementation experience with:

* Full-stack application architecture
* RESTful API design
* Database modelling
* Django ORM
* Authentication and authorization
* Role-Based Access Control
* JWT authentication
* OAuth
* WebSockets
* Event-driven real-time communication
* Redis
* Background/realtime workflows
* Third-party API integration
* LLM integration
* Subscription architecture
* Payment integration
* Docker containerization
* Cloud deployment
* CI/CD
* Environment-based configuration
* API testing
* Production-oriented application structure

---

# 👩‍💻 Author

## Hibah Mohammed K

**Software Engineer | Full-Stack Developer**

Specializing in:

```text
Python
Django
Django REST Framework
React
TypeScript
PostgreSQL
Redis
Docker
AWS
```

### Connect

* 🌐 **Live Project:** https://freightcompare.online
* 💻 **GitHub:** https://github.com/HibahMohammedK
* 💼 **LinkedIn:** https://www.linkedin.com/in/mohammed-hibah-k/

---

# 📄 License

This project was developed as a portfolio project to demonstrate practical full-stack software engineering capabilities, including React, Django, REST API development, AI integration, real-time communication, subscription management, Docker, AWS deployment, and CI/CD.

---

## ⭐ If you find this project interesting

Feel free to explore the live application and source code to learn more about the architecture and implementation.
