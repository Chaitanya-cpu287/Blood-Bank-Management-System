require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

/* ===============================
   DATABASE CONNECTION
=============================== */

require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.log("Database Connection Failed");
    } else {
        console.log("Connected To MySQL");
    }
});

/* ===============================
   DONOR REGISTER
=============================== */

app.post('/api/donors', (req, res) => {

    const {
        name,
        age,
        gender,
        phone,
        address,
        bg_id
    } = req.body;

    db.query(`
        INSERT INTO donors
        (donor_name, age, gender, phone, address, bg_id, last_donation_date)
        VALUES (?, ?, ?, ?, ?, ?, CURDATE())
    `,
    [name, age, gender, phone, address, bg_id],

    (err, result) => {

        if (err) {
            return res.json({ message: "Error Adding Donor" });
        }

        const donorId = result.insertId;

        db.query(`
            INSERT INTO blood_units
            (donor_id, bg_id, collection_date, expiry_date, status)
            VALUES
            (?, ?, CURDATE(),
            DATE_ADD(CURDATE(), INTERVAL 42 DAY),
            'Available')
        `, [donorId, bg_id]);

        res.json({
            message: "Donor Registered Successfully"
        });

    });

});

/* ===============================
   BLOOD REQUEST
=============================== */

app.post('/api/requests', (req, res) => {

    const {
        patient_name,
        phone,
        hospital_name,
        bg_id,
        units_needed,
        priority,
        request_date
    } = req.body;

    db.query(`
        INSERT IGNORE INTO hospitals(hospital_name)
        VALUES (?)
    `, [hospital_name], () => {

        db.query(`
            SELECT hospital_id
            FROM hospitals
            WHERE hospital_name=?
        `, [hospital_name], (err, result) => {

            const hospitalId = result[0].hospital_id;

            db.query(`
                INSERT INTO patients
                (patient_name, phone, bg_id, hospital_id)
                VALUES (?, ?, ?, ?)
            `,
            [patient_name, phone, bg_id, hospitalId],

            (e2, r2) => {

                const patientId = r2.insertId;

                db.query(`
                    INSERT INTO requests
                    (patient_id, units_needed, request_date, priority, status)
                    VALUES (?, ?, ?, ?, 'Pending')
                `,
                [
                    patientId,
                    units_needed,
                    request_date,
                    priority
                ]);

                res.json({
                    message: "Request Added Successfully"
                });

            });

        });

    });

});

/* ===============================
   ISSUE BLOOD
=============================== */

app.post('/api/issue', (req, res) => {

    const {
        request_id,
        bg_id
    } = req.body;

    db.query(`
        SELECT unit_id
        FROM blood_units
        WHERE bg_id=? AND status='Available'
        LIMIT 1
    `,
    [bg_id],

    (err, result) => {

        if (result.length === 0) {
            return res.json({
                message: "No Stock Available"
            });
        }

        const unitId = result[0].unit_id;

        db.query(`
            INSERT INTO blood_issues
            (request_id, unit_id, issue_date)
            VALUES (?, ?, CURDATE())
        `,
        [request_id, unitId]);

        db.query(`
            UPDATE blood_units
            SET status='Issued'
            WHERE unit_id=?
        `,
        [unitId]);

        db.query(`
            UPDATE requests
            SET status='Completed'
            WHERE request_id=?
        `,
        [request_id]);

        res.json({
            message: "Blood Issued Successfully"
        });

    });

});

/* ===============================
   SEARCH DONOR
=============================== */

app.get('/api/search-donor/:name', (req, res) => {

    const key = "%" + req.params.name + "%";

    db.query(`
        SELECT donor_name, phone, age
        FROM donors
        WHERE donor_name LIKE ?
    `,
    [key],

    (err, result) => {
        res.json(result);
    });

});

/* ===============================
   MAIN DASHBOARD
=============================== */

app.get('/api/main-dashboard', (req, res) => {

db.query(`
SELECT
(SELECT COUNT(*) FROM donors) AS total_donors,
(SELECT COUNT(*) FROM requests) AS total_requests,
(SELECT COUNT(*) FROM requests WHERE status='Pending') AS pending_requests,
(SELECT COUNT(*) FROM blood_issues) AS total_issues,
(SELECT COUNT(*) FROM blood_units WHERE status='Available') AS available_units,
(SELECT COUNT(*) FROM blood_units WHERE expiry_date < CURDATE()) AS expired_units,
(SELECT COUNT(*) FROM requests WHERE priority='Emergency' AND status='Pending') AS emergency_requests
`, (err, result) => {

res.json(result[0]);

});

});

/* ===============================
   DONOR DASHBOARD
=============================== */

app.get('/api/donor-dashboard', (req, res) => {

db.query(`
SELECT
(SELECT COUNT(*) FROM donors) AS total_donors,
(SELECT COUNT(*) FROM donors
WHERE DATEDIFF(CURDATE(), last_donation_date) >= 90) AS eligible_donors,
(SELECT COUNT(DISTINCT phone) FROM donors) AS frequent_donors
`, (err, summary) => {

db.query(`
SELECT
d.donor_id,
d.donor_name,
d.phone,
d.age,
b.group_name,
d.last_donation_date
FROM donors d
JOIN blood_groups b ON d.bg_id=b.bg_id
ORDER BY donor_id DESC
`, (e2, list) => {

res.json({
total_donors: summary[0].total_donors,
eligible_donors: summary[0].eligible_donors,
frequent_donors: summary[0].frequent_donors,
list:list
});

});

});

});

/* ===============================
   REQUEST DASHBOARD
=============================== */

app.get('/api/request-dashboard', (req, res) => {

db.query(`
SELECT
COUNT(*) AS total_requests,
SUM(units_needed) AS total_units_required,
SUM(CASE WHEN priority='Emergency' THEN 1 ELSE 0 END)
AS emergency_requests
FROM requests
`, (err, summary) => {

db.query(`
SELECT *
FROM request_details
ORDER BY request_id DESC
`, (e2, list) => {

res.json({
total_requests: summary[0].total_requests,
total_units_required: summary[0].total_units_required,
emergency_requests: summary[0].emergency_requests,
list:list
});

});

});

});

/* ===============================
   PENDING DASHBOARD
=============================== */

app.get('/api/pending-dashboard', (req, res) => {

db.query(`
SELECT
COUNT(*) AS pending_requests,
SUM(CASE WHEN priority='Emergency' THEN 1 ELSE 0 END)
AS emergency_pending
FROM requests
WHERE status='Pending'
`, (err, summary) => {

db.query(`
SELECT
r.request_id,
p.patient_name,
b.group_name,
r.units_needed,
r.priority,

CASE
WHEN (
SELECT COUNT(*)
FROM blood_units u
WHERE u.bg_id=p.bg_id
AND u.status='Available'
) >= r.units_needed
THEN 'Available'
ELSE 'Low'
END AS stock_status

FROM requests r
JOIN patients p ON r.patient_id=p.patient_id
JOIN blood_groups b ON p.bg_id=b.bg_id
WHERE r.status='Pending'
ORDER BY FIELD(priority,'Emergency','Normal','Low')
`, (e2, list) => {

let shortage = 0;

list.forEach(item => {
if(item.stock_status === 'Low'){
shortage++;
}
});

res.json({
pending_requests: summary[0].pending_requests,
emergency_pending: summary[0].emergency_pending,
shortage_cases: shortage,
list:list
});

});

});

});

/* =====================================
   BLOOD AVAILABILITY DASHBOARD
===================================== */

app.get('/api/availability-dashboard', (req, res) => {

db.query(`

SELECT
bg.group_name,

IFNULL(av.available_units,0)
AS available_units,

IFNULL(req.requested_units,0)
AS requested_units,

CASE
WHEN IFNULL(req.requested_units,0) >
IFNULL(av.available_units,0)

THEN
IFNULL(req.requested_units,0) -
IFNULL(av.available_units,0)

ELSE 0
END AS shortage

FROM blood_groups bg

LEFT JOIN
(
SELECT bg_id,
COUNT(*) AS available_units
FROM blood_units
WHERE status='Available'
GROUP BY bg_id
) av
ON bg.bg_id = av.bg_id

LEFT JOIN
(
SELECT p.bg_id,
SUM(r.units_needed) AS requested_units
FROM requests r
JOIN patients p
ON r.patient_id=p.patient_id
WHERE r.status='Pending'
GROUP BY p.bg_id
) req
ON bg.bg_id = req.bg_id

ORDER BY bg.group_name

`, (err, list) => {

let totalAvailable = 0;
let totalRequested = 0;
let shortageGroups = 0;

list.forEach(item=>{

totalAvailable += Number(item.available_units);
totalRequested += Number(item.requested_units);

if(item.shortage > 0){
shortageGroups++;
}

});

res.json({
total_available: totalAvailable,
total_requested: totalRequested,
shortage_groups: shortageGroups,
list:list
});

});

});

/* ===============================
   START SERVER
=============================== */

app.listen(3000, () => {
    console.log("Running on http://localhost:3000");
});