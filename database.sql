CREATE DATABASE IF NOT EXISTS Blood;
USE Blood;

/* ===========================
   MASTER TABLES
=========================== */

CREATE TABLE blood_groups(
    bg_id INT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(5) UNIQUE NOT NULL
);

INSERT INTO blood_groups(group_name)
VALUES
('A+'),('A-'),
('B+'),('B-'),
('AB+'),('AB-'),
('O+'),('O-');

CREATE TABLE hospitals(
    hospital_id INT PRIMARY KEY AUTO_INCREMENT,
    hospital_name VARCHAR(100) UNIQUE NOT NULL
);

/* ===========================
   DONORS
=========================== */

CREATE TABLE donors(
    donor_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_name VARCHAR(100) NOT NULL,
    age INT CHECK(age >= 18),
    gender VARCHAR(10),
    phone VARCHAR(15) UNIQUE,
    address VARCHAR(200),
    bg_id INT NOT NULL,
    last_donation_date DATE,
    FOREIGN KEY(bg_id) REFERENCES blood_groups(bg_id)
);

/* ===========================
   PATIENTS
=========================== */

CREATE TABLE patients(
    patient_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_name VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    bg_id INT NOT NULL,
    hospital_id INT,
    FOREIGN KEY(bg_id) REFERENCES blood_groups(bg_id),
    FOREIGN KEY(hospital_id) REFERENCES hospitals(hospital_id)
);

/* ===========================
   BLOOD STOCK
=========================== */

CREATE TABLE blood_units(
    unit_id INT PRIMARY KEY AUTO_INCREMENT,
    donor_id INT,
    bg_id INT NOT NULL,
    collection_date DATE,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'Available',
    FOREIGN KEY(donor_id) REFERENCES donors(donor_id),
    FOREIGN KEY(bg_id) REFERENCES blood_groups(bg_id)
);

/* ===========================
   REQUESTS
=========================== */

CREATE TABLE requests(
    request_id INT PRIMARY KEY AUTO_INCREMENT,
    patient_id INT,
    units_needed INT,
    request_date DATE,
    priority VARCHAR(20) DEFAULT 'Normal',
    status VARCHAR(20) DEFAULT 'Pending',
    FOREIGN KEY(patient_id) REFERENCES patients(patient_id)
);

/* ===========================
   BLOOD ISSUE
=========================== */

CREATE TABLE blood_issues(
    issue_id INT PRIMARY KEY AUTO_INCREMENT,
    request_id INT UNIQUE,
    unit_id INT UNIQUE,
    issue_date DATE,
    FOREIGN KEY(request_id) REFERENCES requests(request_id),
    FOREIGN KEY(unit_id) REFERENCES blood_units(unit_id)
);

/* ===========================
   INDEXES
=========================== */

CREATE INDEX idx_donor_name ON donors(donor_name);
CREATE INDEX idx_donor_phone ON donors(phone);

/* ===========================
   VIEWS
=========================== */

/* Blood Stock Dashboard */

CREATE VIEW stock_summary AS
SELECT
b.group_name,
COUNT(*) AS units
FROM blood_units u
JOIN blood_groups b
ON u.bg_id = b.bg_id
WHERE u.status = 'Available'
GROUP BY b.group_name;

/* Reports Dashboard */

CREATE VIEW reports_summary AS
SELECT
(SELECT COUNT(*) FROM donors) AS total_donors,
(SELECT COUNT(*) FROM requests) AS total_requests,
(SELECT COUNT(*) FROM requests WHERE status='Pending') AS pending_requests,
(SELECT COUNT(*) FROM requests WHERE status='Completed') AS completed_requests,
(SELECT COUNT(*) FROM blood_units WHERE status='Available') AS available_units;

/* Request Full View */

CREATE VIEW request_details AS
SELECT
r.request_id,
p.patient_name,
h.hospital_name,
b.group_name,
r.units_needed,
r.priority,
r.request_date,
r.status,
p.bg_id
FROM requests r
JOIN patients p ON r.patient_id = p.patient_id
JOIN hospitals h ON p.hospital_id = h.hospital_id
JOIN blood_groups b ON p.bg_id = b.bg_id;

/* ===========================
   SAMPLE DATA
=========================== */

INSERT INTO donors
(donor_name, age, gender, phone, address, bg_id, last_donation_date)
VALUES
('Rahul',24,'Male','9876543210','Vijayawada',7,CURDATE()),
('Priya',22,'Female','9876543211','Guntur',1,CURDATE());

INSERT INTO blood_units
(donor_id,bg_id,collection_date,expiry_date,status)
VALUES
(1,7,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 42 DAY),'Available'),
(2,1,CURDATE(),DATE_ADD(CURDATE(),INTERVAL 42 DAY),'Available');

/* ===========================
   USEFUL QUERIES
=========================== */

/* Eligible Donors */
SELECT donor_name
FROM donors
WHERE DATEDIFF(CURDATE(), last_donation_date) >= 90;

/* Expired Units */
SELECT *
FROM blood_units
WHERE expiry_date < CURDATE();

/* Emergency Requests First */
SELECT *
FROM requests
ORDER BY FIELD(priority,'Emergency','Normal','Low');

SELECT *
FROM requests;

/* ==================================
   REQUEST DETAILS VIEW
================================== */

CREATE OR REPLACE VIEW request_details AS
SELECT
r.request_id,
p.patient_name,
h.hospital_name,
b.group_name,
r.units_needed,
r.priority,
r.request_date,
r.status,
p.bg_id

FROM requests r
JOIN patients p
ON r.patient_id = p.patient_id

JOIN hospitals h
ON p.hospital_id = h.hospital_id

JOIN blood_groups b
ON p.bg_id = b.bg_id;


/* ==================================
   STOCK SUMMARY VIEW
================================== */

CREATE OR REPLACE VIEW stock_summary AS
SELECT
b.group_name,
COUNT(*) AS available_units

FROM blood_units u
JOIN blood_groups b
ON u.bg_id = b.bg_id

WHERE u.status = 'Available'
GROUP BY b.group_name;



/* ==================================
   REPORT SUMMARY VIEW
================================== */

CREATE OR REPLACE VIEW reports_summary AS
SELECT

(SELECT COUNT(*) FROM donors) AS total_donors,

(SELECT COUNT(*) FROM requests) AS total_requests,

(SELECT COUNT(*) FROM requests
WHERE status='Pending') AS pending_requests,

(SELECT COUNT(*) FROM blood_issues)
AS total_issues,

(SELECT COUNT(*) FROM blood_units
WHERE status='Available')
AS available_units;








/* ==================================
   INDEXES FOR FAST SEARCH
================================== */

CREATE INDEX idx_donor_name
ON donors(donor_name);

CREATE INDEX idx_phone
ON donors(phone);

/* ==================================
   SAMPLE DATA (OPTIONAL)
================================== */

INSERT INTO hospitals(hospital_name)
VALUES ('City Hospital')
ON DUPLICATE KEY UPDATE hospital_name=hospital_name;





