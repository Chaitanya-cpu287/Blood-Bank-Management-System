# 🩸 BloodCare — Blood Bank Management System

BloodCare is a modern full-stack Blood Bank Management System developed to streamline donor management, blood inventory tracking, emergency blood requests, and blood issue operations through a centralized healthcare dashboard.

The system is designed for internal blood bank operations where authorized blood bank representatives manage donor registrations, patient requests, blood stock monitoring, and blood issue workflows efficiently.

Built with a modern healthcare-inspired UI, responsive dashboards, and real-time inventory management features, the project demonstrates practical implementation of DBMS concepts integrated with a professional web application architecture.

---

# 🚀 Features

## 👨‍⚕️ Donor Management
- Register blood donors
- Maintain donor records
- Blood group tracking
- Search donor functionality
- Donor analytics dashboard

---

## 🏥 Blood Request Management
- Create emergency and normal blood requests
- Priority-based request handling
- Hospital and patient management
- Request monitoring dashboard

---

## 🩸 Blood Inventory Management
- Real-time blood stock monitoring
- Blood group availability tracking
- Shortage detection system
- Inventory analytics dashboard

---

## 💉 Blood Issue Management
- Issue blood units securely
- Automatic inventory updates
- Pending request processing
- Blood issue workflow management

---

## 📊 Analytics Dashboard
- Total donors overview
- Total blood requests
- Pending request monitoring
- Available blood unit tracking
- Emergency request analytics

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- JavaScript
- Font Awesome
- Google Fonts (Poppins)

---

## Backend
- Node.js
- Express.js

---

## Database
- MySQL

Database implementation includes:
- Relational schema design
- Foreign key constraints
- Views
- Indexes
- Inventory management queries
- Aggregation and analytical queries

---

# 📁 Project Structure

```text
BloodCare/
│
├── public/
│   ├── index.html
│   ├── donor.html
│   ├── donor_dashboard.html
│   ├── request.html
│   ├── request_dashboard.html
│   ├── pending_dashboard.html
│   ├── availability_dashboard.html
│   ├── analytics.html
│   └── issue.html
│
├── server.js
├── database.sql
├── package.json
├── .env
└── README.md
```

---

# 🗄️ Database Tables

Main database entities:
- donors
- blood_groups
- blood_units
- requests
- patients
- hospitals
- blood_issues

---

# 🔗 API Endpoints

## Donor APIs

```http
POST /api/donors
GET  /api/donor-dashboard
GET  /api/search-donor/:name
```

---

## Request APIs

```http
POST /api/requests
GET  /api/request-dashboard
GET  /api/pending-dashboard
```

---

## Blood Issue APIs

```http
POST /api/issue
POST /api/issue-blood
```

---

## Dashboard APIs

```http
GET /api/main-dashboard
GET /api/availability-dashboard
```

---

# ⚙️ Installation & Setup

## 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/bloodcare-management-system.git
```

---

## 2️⃣ Navigate to Project Directory

```bash
cd bloodcare-management-system
```

---

## 3️⃣ Install Dependencies

```bash
npm install
```

---

## 4️⃣ Configure Database

Import the SQL file into MySQL:

```text
database.sql
```

---

## 5️⃣ Create Environment Variables

Create a `.env` file in the root directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=Blood
```

---

## 6️⃣ Run the Server

```bash
node server.js
```

Server will run at:

```text
http://localhost:3000
```

---

# 💻 System Modules

- Landing Page
- Donor Registration Portal
- Blood Request Portal
- Main Analytics Dashboard
- Donor Dashboard
- Request Dashboard
- Pending Request Dashboard
- Blood Availability Dashboard
- Blood Issue Management Portal

---

# 🔐 Security Notes

Before pushing the project to GitHub:

✅ Use environment variables for database credentials

✅ Add `.env` to `.gitignore`

Example:

```gitignore
node_modules
.env
```

❌ Do not upload:
- Database passwords
- API keys
- Secrets
- Environment files

---

# 📈 Future Enhancements

- JWT Authentication
- OTP-based Secure Login
- Admin Authentication Portal
- Role-Based Access Control
- Dark Mode
- Chart.js Visual Analytics
- PDF Report Generation
- Email/SMS Notifications
- Real-Time Updates using Socket.IO

---

# 🧠 Project Objective

The objective of this project is to digitize and simplify blood bank operations by providing a centralized system for:

- donor registration
- blood request management
- blood inventory tracking
- emergency request handling
- blood issue processing
- healthcare analytics

The system improves operational efficiency, reduces manual effort, and enables faster emergency response handling.

---

# 👨‍💻 Author

**Chaitanya Mylapalli**

---
