# BloodCare — Full-Stack Blood Bank Management & Inventory System

BloodCare is a full-stack healthcare web application designed to streamline donor management, blood inventory auditing, emergency transfusion requests, and blood issuance operations through a centralized dashboard.

Developed for healthcare providers and blood banks to manage donor records, patient emergency requests, shortage warnings, and transaction logs.

---

## Key Features

- **Donor Registration & Record Auditing:**
  - Register new blood donors with medical history and eligibility criteria.
  - Track blood group classification (A+, A-, B+, B-, AB+, AB-, O+, O-).
  - Search donor registries by blood type and location.
- **Real-Time Blood Inventory & Availability:**
  - Live stock tracking per blood unit.
  - Automated shortage alerts when threshold reserves fall below safety limits.
- **Emergency Blood Request Pipeline:**
  - Create and manage urgent transfusion requests with priority tagging (Emergency vs. Standard).
  - Hospital allocation and patient requirement tracking.
- **Blood Issuance & Transaction History:**
  - Secure issuance workflows with immediate inventory reconciliation.
  - Comprehensive transactional audit logs preventing record drift.

---

## Tech Stack & Architecture

- **Backend:** Node.js, Express.js (v5), RESTful API design
- **Database:** MySQL (`mysql2` connection pool)
- **Frontend:** Semantic HTML5, CSS3, JavaScript (Fetch API)
- **Security & Config:** `dotenv` environment encapsulation, parameterized SQL queries

---

## Project Structure

```
├── public/
│   ├── analytics.html              # Inventory analytics & visualizations
│   ├── availability_dashboard.html # Live blood stock levels
│   ├── donor.html                  # Donor intake registration
│   ├── donor_dashboard.html        # Donor directory & search
│   ├── emergency_requests.html     # Urgent blood requests
│   └── index.html                  # Main navigation portal
├── database.sql                    # MySQL schema definition & seed data
├── server.js                       # Express application & database controllers
├── package.json                    # Project dependencies
├── .env.example                    # Environment configuration template
└── README.md                       # Documentation
```

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL Server instance

### Setup Instructions

1. Clone repository:
   ```bash
   git clone https://github.com/Chaitanya-cpu287/Blood-Bank-Management-System.git
   cd Blood-Bank-Management-System
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Database Initialization:
   Import the schema into your local MySQL server:
   ```bash
   mysql -u root -p < database.sql
   ```

4. Configure Environment Variables:
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_NAME=blood_bank_db
   ```

5. Launch the Server:
   ```bash
   node server.js
   ```
   Open `http://localhost:5000` in your web browser.
