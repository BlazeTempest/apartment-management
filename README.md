# Apartment Management System

## 1. Introduction

A full-stack web application designed to streamline apartment management tasks for both administrators and tenants. This system facilitates managing tenant information, leases, maintenance requests, and payments.

**Target Users:**
*   **Administrators:** Manage the overall property, tenants, leases, maintenance, and finances.
*   **Tenants:** View lease details, submit maintenance requests, make payments, and manage their profile.

## 2. Tech Stack

*   **Backend:** Spring Boot (Java)
*   **Frontend:** React (JavaScript/TypeScript)
*   **Database:** MySQL
*   **Styling:** Tailwind CSS (as used in mocks) + ShadCN/UI

## 3. Features

Based on the provided mockups (`login.html`, `admin.html`, `tenant.html`):

**Core:**
*   User Authentication (Login for Admins & Tenants)
*   Role-based access control (JWT-based auth)
*   Dark Mode Theme Toggle (Persistent with Local Storage)

**Admin Portal:**
*   **Dashboard Overview:**
    *   Total Tenants
    *   Active Leases
    *   Open Maintenance Requests
    *   Monthly Revenue Summary
*   **Tenant Management:**
    *   View/Add/Edit/Delete Tenants
    *   View tenant profile details and lease history
*   **Lease Management:**
    *   Create, view, and terminate leases
    *   Attach lease PDFs
*   **Maintenance Management:**
    *   View and update requests
    *   Assign status and technician notes
*   **Payment Management:**
    *   Track payments (completed and pending)
    *   Export reports

**Tenant Portal:**
*   **Dashboard:**
    *   Lease summary, current balance, next due date, and request tracker
    *   Quick actions ("Pay Now", "New Maintenance Request")
*   **Lease Details:**
    *   View lease terms, rent, deposit, and download document
*   **Maintenance:**
    *   Submit issue (type, description, preferred date, urgency)
    *   Track progress/status
*   **Payments:**
    *   Online payments (card/paypal integration stub)
    *   View payment history
*   **Profile Management:**
    *   Update personal and emergency contact details

## 4. Project Structure

```
.
├── backend/                  # Spring Boot Application
│   ├── src/
│   │   ├── main/java/com/example/apartmentmanagement/
│   │   │   ├── controller/   # REST APIs
│   │   │   ├── service/      # Business Logic
│   │   │   ├── repository/   # Spring Data JPA Repositories
│   │   │   ├── model/        # Entities
│   │   │   ├── dto/          # DTOs for requests/responses
│   │   │   ├── config/       # Security, JWT, CORS configs
│   │   │   └── security/     # Filters, UserDetailsService
│   │   └── resources/
│   │       └── application.properties
│   └── pom.xml
│
├── frontend/                 # React + Tailwind + ShadCN UI
│   ├── public/
│   ├── src/
│   │   ├── components/       # UI building blocks
│   │   ├── pages/            # Dashboard, Lease, Payments, etc.
│   │   ├── services/         # Axios API service functions
│   │   ├── contexts/         # Theme/Auth providers
│   │   ├── hooks/            # useAuth, useDarkMode, etc.
│   │   ├── assets/           # Icons/images
│   │   └── App.tsx          # Routing and layout
│   └── tailwind.config.js
│
└── README.md
```

## 5. Database Schema Outline

**Main Entities:**

*   `users` (id, email, password_hash, role)
*   `profiles` (id, user_id, full_name, phone, emergency_contact)
*   `apartments` (id, unit_number, address, floor, description)
*   `tenants` (id, profile_id, apartment_id, status)
*   `leases` (id, tenant_id, apartment_id, start_date, end_date, rent, deposit, status, pdf_url)
*   `maintenance_requests` (id, tenant_id, apartment_id, issue_type, description, preferred_date, urgency, status, technician_notes, created_at, resolved_at)
*   `payments` (id, lease_id, tenant_id, amount, payment_date, method, transaction_id, status)

## 6. Setup and Installation

**Prerequisites:**
* Java 17+
* Maven
* Node.js + npm
* MySQL Server

**Backend Setup:**
```bash
cd backend
# Configure DB in application.properties
mvn clean install
mvn spring-boot:run
```

**Frontend Setup:**
```bash
cd frontend
npm install
npm run dev
```

## 7. Running the Application

1. Start MySQL and create your schema.
2. Start backend (`localhost:8080`).
3. Start frontend (`localhost:3000`).
4. Access login screen for Admin/Tenant.

## 8. API Endpoints (Sample)

### Auth
* `POST /api/auth/login`
* `GET /api/auth/me`

### Admin APIs
* `GET /api/admin/tenants`
* `POST /api/admin/tenants`
* `PUT /api/admin/tenants/{id}`
* `DELETE /api/admin/tenants/{id}`
* `GET /api/admin/leases`
* `POST /api/admin/leases`
* `PUT /api/admin/leases/{id}/terminate`
* `GET /api/admin/maintenance`
* `PUT /api/admin/maintenance/{id}`
* `GET /api/admin/payments`

### Tenant APIs
* `GET /api/tenant/dashboard`
* `GET /api/tenant/lease`
* `GET /api/tenant/maintenance`
* `POST /api/tenant/maintenance`
* `GET /api/tenant/payments`
* `POST /api/tenant/payments`
* `GET /api/tenant/profile`
* `PUT /api/tenant/profile`

---
Let me know if you want mock data samples or API response shapes added next!
