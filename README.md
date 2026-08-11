# 🚚 FreightCompare

An AI-powered freight comparison platform that enables customers to compare freight transport options, track prices, receive real-time notifications, and manage logistics operations through an intelligent and modern web application.

FreightCompare is built using **React**, **Django REST Framework**, **PostgreSQL**, **Docker**, **Redis**, and **Groq LLM**, providing a scalable architecture for freight comparison and logistics management.

## 📸 Application Preview

> 🚧 **Project Status:** Nearing Completion
>
> Core freight comparison, administration, real-time notifications, customer chat, and ticket management modules have been implemented.
>
> Remaining work focuses on optimisation and refinements, including AI assistant optimisation, media/file sharing in chat, subscription management enhancements, final UI/UX improvements, testing, performance optimisation, and deployment.

## 📑 Table of Contents

* [Features](#-features)
* [AI Assistant](#-ai-assistant)
* [Real-Time Notifications](#-real-time-notifications)
* [Tech Stack](#-tech-stack)
* [Project Architecture](#-project-architecture)
* [Environment Variables](#-environment-variables)
* [Getting Started](#-getting-started)
* [Current Modules](#-current-modules)
* [Screenshots](#-screenshots)
* [Remaining Work](#-remaining-work)
* [Project Goals](#-project-goals)
* [Author](#-author)
* [License](#-license)

---

## ✨ Features

### 👤 Customer

* Search and compare freight transport options
* Save favourite transport routes
* Search history
* Price alerts
* Real-time notifications
* Google Authentication
* JWT Authentication
* Premium subscription support
* Customer support chat
* Real-time ticket management

### 👨‍💼 Administrator

* Transport Management
* Company Management
* Customer Management
* Subscription Management
* CSV Bulk Upload
* AI Transport Assistant
* Dashboard
* Ticket Management

### 👨‍💻 Staff

* Staff Dashboard
* Notification Management
* Customer Support
* Ticket Management

---

## 🤖 AI Assistant

FreightCompare includes an AI-powered transport assistant designed to simplify transport creation and provide intelligent freight recommendations.

Features include:

* AI-assisted freight recommendations
* Tavily Search integration
* Groq Llama 3.3 integration
* Automatic company extraction
* Price extraction
* Duration extraction
* Confidence scoring
* One-click transport creation

The core AI assistant functionality has been implemented, with further optimisation and refinement remaining.

---

## 🔔 Real-Time Notifications

FreightCompare provides real-time notifications using:

* Django Channels
* Redis
* WebSockets

Users receive instant notifications for:

* Price Alert updates
* Route Match notifications
* System notifications
* Other application events

---

## 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Redux Toolkit
* Tailwind CSS
* React Router
* Axios

### Backend

* Django
* Django REST Framework
* PostgreSQL
* JWT Authentication
* Google OAuth

### AI

* Groq Llama 3.3
* Tavily Search API

### Real-Time

* Django Channels
* Redis
* WebSockets

### DevOps

* Docker
* Docker Compose

---

## 🏗 Project Architecture

```text
                    React Frontend
                           │
                    Redux Toolkit
                           │
                        Axios API
                           │
──────────────── REST API ────────────────
                           │
               Django REST Framework
                           │
                  Business Logic Layer
                           │
                     PostgreSQL Database
                           │
                         Redis Cache
                           │
                    Django Channels
                           │
                      WebSockets
                           │
                  Real-Time Communication
```

---

## 🔐 Environment Variables

FreightCompare uses environment variables for application configuration, database connectivity, authentication, third-party services, AI integrations, payments, and email services.

Create the required `.env` files locally and configure the following variables.

> ⚠️ **Security:** Never commit `.env` files, API keys, passwords, secret keys, or other credentials to the repository.

### Django & Application

```env
SECRET_KEY=
DEBUG=
```

### PostgreSQL

```env
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=
```

### AI Services

```env
TAVILY_API_KEY=
GROQ_API_KEY=
```

### Stripe

```env
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
STRIPE_PRICE_ID=
STRIPE_WEBHOOK_SECRET=
```

### Google Authentication

```env
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Email / SMTP

```env
EMAIL_HOST=
EMAIL_PORT=
EMAIL_HOST_USER=
EMAIL_HOST_PASSWORD=
EMAIL_USE_TLS=
DEFAULT_FROM_EMAIL=
```

The values are intentionally omitted. Configure each variable according to the local development or deployment environment.

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/HibahMohammedK/FreightCompare.git

cd FreightCompare
```

### Configure Environment Variables

Create the required `.env` files and configure the variables listed in the **Environment Variables** section.

Do not commit your `.env` files to Git.

### Run with Docker

```bash
docker compose up --build
```

### Application URLs

**Backend**

```text
http://localhost:8000
```

**Frontend**

```text
http://localhost:5173
```

---

## 📌 Current Modules

* ✅ Authentication
* ✅ Google Login
* ✅ Customer Dashboard
* ✅ Transport Comparison
* ✅ Saved Routes
* ✅ Search History
* ✅ Price Alerts
* ✅ Real-Time Notifications
* 🟡 AI Transport Assistant — Core functionality implemented; optimisation and refinement remaining
* ✅ Company Management
* ✅ Transport Management
* ✅ Customer Management
* 🟡 Subscription Management — Customer functionality implemented; admin-side enhancements remaining
* ✅ CSV Upload
* ✅ Customer Support Chat
* ✅ Real-Time Ticket Management
* ✅ Staff Dashboard
* ✅ Notification Management
* ✅ Dockerized Development

---

# 📸 Screenshots

## 👤 Customer Experience

### Landing Page

### Transport Search

### Price Alerts

### Real-Time Notifications

### Customer Support Chat

### Ticket Management

---

## 👨‍💼 Administration

### Admin Dashboard

### Transport Management

### CSV Upload

### AI Transport Assistant

### Customer Management

### Subscription Management

---

## 🚧 Remaining Work

* AI Assistant optimisation and refinement
* Media and file sharing in chat
* Subscription management enhancements in the administration module
* Final UI/UX refinements
* Testing and performance optimisation
* Cloud deployment

---

## 🎯 Project Goals

The objective of FreightCompare is to modernize freight comparison by combining traditional logistics management with AI-powered recommendations and real-time communication technologies.

The project focuses on:

* Improving transport comparison
* Intelligent logistics recommendations
* Better customer engagement
* Real-time customer support
* Scalable system architecture
* Modern software engineering practices
* AI-assisted logistics operations

---

## 👩‍💻 Author

**Hibah Mohammed K**

Software Developer | Full Stack Developer

* 🌐 GitHub: https://github.com/HibahMohammedK
* 💼 LinkedIn: https://www.linkedin.com/in/mohammed-hibah-k/

---

## 📄 License

This project was developed as a portfolio project to demonstrate modern full-stack software engineering practices using React, Django, AI integration, real-time communication, and logistics technology.
