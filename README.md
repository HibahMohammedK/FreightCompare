🚚 FreightCompare

An AI-powered freight comparison and logistics management platform that enables customers to compare freight transport options, track prices, receive real-time notifications, communicate with support staff, and manage freight requirements through a modern web application.

FreightCompare is built using React, TypeScript, Django REST Framework, PostgreSQL, Redis, Docker, Django Channels, Groq LLM, and Tavily Search.

The application provides separate workflows for customers, administrators, and support staff, including authentication, freight comparison, AI-assisted transport operations, subscription management, real-time communication, customer support, and logistics management.

📸 Application Preview

🚧 Project Status: Development Complete

The core application functionality has been implemented, including authentication, freight comparison, transport and company management, subscriptions, AI assistance, real-time notifications, customer support chat, ticket management, price alerts, and administrative workflows.

The current phase focuses on testing, CI/CD, deployment, performance validation, and final production refinements.

📑 Table of Contents

Features

AI Transport Assistant

Real-Time Communication

Customer Support

Subscription System

Authentication

Tech Stack

Environment Variables

Getting Started

Application Modules

Testing

CI/CD

Deployment

Screenshots

Project Goals

Author

License

✨ Features

👤 Customer

Customers can:

Search and compare freight transport options

Filter transport options by route and transport type

View transport pricing and duration

Save transport options

View search history

Create and manage price alerts

Receive real-time notifications

Authenticate using email/password

Authenticate using Google

Manage their profile

Change their password

Reset forgotten passwords

Subscribe to premium plans

View subscription history

Cancel subscriptions

Use the AI Transport Assistant

Create customer support tickets

Communicate with support staff through real-time chat

Track ticket status and updates

👨‍💼 Administrator

Administrators can:

Access the administration dashboard

Manage transport records

Add and update transport information

Upload transport data through CSV

Manage freight companies

Activate and deactivate companies

Manage customers

Manage staff

Manage subscription plans

Monitor customer subscriptions

Manage support tickets

Assign tickets to staff

Reassign tickets between staff members

Monitor real-time staff availability

Use the AI Transport Assistant

Receive real-time administrative notifications

👨‍💻 Support Staff

Support staff can:

Access the staff dashboard

View assigned support tickets

Manage ticket status

Communicate with customers

Receive real-time notifications

Participate in real-time customer support conversations

Maintain staff availability status

Receive automatically assigned support tickets

🤖 AI Transport Assistant

FreightCompare includes an AI-powered transport assistant designed to assist with freight transport research and transport data creation.

AI capabilities

AI-assisted freight recommendations

Tavily Search integration

Groq LLM integration

Transport information extraction

Company extraction

Price extraction

Duration extraction

Transport type identification

Confidence scoring

AI-assisted transport creation

🔔 Real-Time Communication

FreightCompare uses Django Channels, Redis, and WebSockets to provide real-time application communication.

Real-time functionality includes:

Notification delivery

Ticket updates

Ticket assignment updates

Ticket status updates

Customer support chat

Message delivery

Message read status

Staff presence

Online/offline availability

Route-match notifications

Price-alert notifications

💬 Customer Support

The platform includes an integrated customer support system.

Support workflow

Customer creates a support ticket

Ticket is automatically assigned to available support staff

Assignment uses workload balancing and round-robin selection

Staff receives a real-time notification

Customer and staff communicate through real-time chat

Ticket status can be updated throughout the support process

Customer receives status notifications

Administrators can monitor and reassign tickets

Supported ticket statuses include:

Open

Assigned

In Progress

Resolved

Closed

💳 Subscription System

FreightCompare includes a subscription-based feature system.

Subscription plans support:

Monthly billing

Yearly billing

Feature-based access

Usage limits

Premium functionality

Subscription history

Subscription cancellation

Stripe integration

Application features can be controlled using subscription-plan permissions and limits.

🔐 Authentication

FreightCompare implements multiple authentication and account-management features.

JWT authentication

Google OAuth authentication

Email verification

OTP verification

Password reset

Password change

Forced password change for staff accounts

Role-based access control

Supported user roles:

Customer

Staff

Administrator

🛠 Tech Stack

Frontend

React

TypeScript

Redux Toolkit

Tailwind CSS

React Router

Axios

Vite

Backend

Python

Django

Django REST Framework

PostgreSQL

JWT Authentication

Google OAuth

AI

Groq LLM

Tavily Search API

Real-Time

Django Channels

Redis

WebSockets

Payments

Stripe

DevOps

Docker

Docker Compose

Git

GitHub

🔐 Environment Variables

FreightCompare uses environment variables for application configuration, database connectivity, authentication, third-party services, AI integrations, payments, and email services.

⚠️ Security: Never commit .env files, API keys, passwords, secret keys, or other credentials to the repository.

Create the required environment files locally.

Backend Environment Variables

Create:

backend/.env

Add the following variables:

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

Configure each value according to your local or deployment environment.

Frontend Environment Variables

Create:

frontend/.env

Add the frontend-specific variables required by the application.

Example:

VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=

Use the exact variable names required by your current frontend configuration. Do not commit the actual values.

🚀 Getting Started

Prerequisites

Make sure the following are installed:

Git

Docker

Docker Compose

For local development without Docker, also install:

Node.js

npm

Python

PostgreSQL

Redis

1. Clone the Repository

git clone https://github.com/HibahMohammedK/FreightCompare.git
cd FreightCompare

2. Configure Environment Variables

Create:

backend/.env

Configure the required backend variables described in the Environment Variables section.

Create:

frontend/.env

Configure the required frontend variables.

Do not commit either .env file to Git.

3. Run the Application with Docker

Build and start the application:

docker compose up --build

To run in detached mode:

docker compose up --build -d

To stop the application:

docker compose down

4. Application URLs

Frontend

http://localhost:5173

Backend

http://localhost:8000

5. Database Migrations

If migrations need to be applied manually inside the backend container:

docker compose exec backend python manage.py migrate

6. Create a Django Superuser

To create an administrator account:

docker compose exec backend python manage.py createsuperuser

Follow the prompts in the terminal.

📌 Application Modules

Module

Status

Authentication

✅ Complete

Google Authentication

✅ Complete

Email Verification

✅ Complete

Password Reset

✅ Complete

Customer Dashboard

✅ Complete

Transport Comparison

✅ Complete

Transport Management

✅ Complete

Saved Transports

✅ Complete

Search History

✅ Complete

Price Alerts

✅ Complete

Real-Time Notifications

✅ Complete

AI Transport Assistant

✅ Complete

Company Management

✅ Complete

Customer Management

✅ Complete

Staff Management

✅ Complete

Subscription Management

✅ Complete

Stripe Integration

✅ Complete

CSV Transport Upload

✅ Complete

Customer Support

✅ Complete

Real-Time Chat

✅ Complete

Ticket Management

✅ Complete

Automatic Ticket Assignment

✅ Complete

Staff Presence

✅ Complete

Dockerized Development

✅ Complete

🧪 Testing

Testing is part of the final project-hosting phase.

The testing process covers:

Backend API testing

Serializer validation

Authentication testing

Permission testing

Transport management testing

Price alert testing

Subscription functionality testing

Ticket management testing

Chat functionality testing

WebSocket functionality testing

Notification testing

Frontend functionality testing

Integration testing

Regression testing

Automated tests will be executed as part of the CI/CD pipeline.

🔄 CI/CD

A CI/CD pipeline will be implemented to automate application validation and deployment workflows.

The planned pipeline will:

Trigger when changes are pushed to GitHub

Install project dependencies

Run automated tests

Validate the backend

Build the frontend

Build Docker images

Verify the application build

Deploy the application to the configured hosting environment

The CI/CD workflow will help reduce deployment errors and ensure that changes are validated before deployment.

☁️ Deployment

The application is containerized using Docker and Docker Compose.

The deployment process will use:

GitHub
   │
   ▼
CI/CD Pipeline
   │
   ├── Automated Tests
   ├── Frontend Build
   ├── Backend Validation
   └── Docker Build
           │
           ▼
    Hosting Environment

Production deployment configuration depends on the selected hosting infrastructure.

📸 Screenshots

👤 Customer Experience

Landing Page

Add screenshot here.

Transport Search

Add screenshot here.

Search Results

Add screenshot here.

Price Alerts

Add screenshot here.

Real-Time Notifications

Add screenshot here.

Customer Support Chat

Add screenshot here.

Ticket Management

Add screenshot here.

👨‍💼 Administration

Admin Dashboard

Add screenshot here.

Transport Management

Add screenshot here.

Company Management

Add screenshot here.

CSV Upload

Add screenshot here.

AI Transport Assistant

Add screenshot here.

Customer Management

Add screenshot here.

Subscription Management

Add screenshot here.

Ticket Monitoring

Add screenshot here.

🎯 Project Goals

The objective of FreightCompare is to modernize freight comparison by combining traditional logistics management with AI-powered assistance and real-time communication.

The project focuses on:

Improving freight transport comparison

Providing intelligent logistics assistance

Simplifying transport data management

Providing real-time customer support

Improving customer engagement

Supporting subscription-based functionality

Implementing scalable backend services

Applying modern full-stack development practices

Using containerized application deployment

Implementing automated testing and CI/CD

Demonstrating practical AI integration in logistics

👩‍💻 Author

Hibah Mohammed K

Software Developer | Full Stack Developer

🌐 GitHub: https://github.com/HibahMohammedK

💼 LinkedIn: https://www.linkedin.com/in/mohammed-hibah-k/

📄 License

This project was developed as a portfolio project to demonstrate modern full-stack software engineering practices using React, Django, AI integration, real-time communication, subscription management, Docker, testing, and CI/CD.