const express = require("express");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());

// 🔥 Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

const PORT = 4000;
const SECRET = "gov-secret-key";

// 🔹 Base URL of course website
const COURSE_SITE_BASE = "http://127.0.0.1:5501/couressit";

// Short-lived one-time tickets used to open the course site.
const courseTickets = new Map();

// Fake users database
const users = [
  {
    id: 1,
    username: "harish",
    password: "1234",
    eligibleCourses: [
      "java",
      "javascript",
      "android",
      "django",
      "html",
      "python",
      "react",
      "sql",
    ]
  }
];

/* =========================
   LOGIN API
========================= */
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    u => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: user.id,
      eligibleCourses: user.eligibleCourses
    },
    SECRET,
    { expiresIn: "10m" }
  );

  res.json({
    token,
    eligibleCourses: user.eligibleCourses
  });
});

/* =========================
   COURSE REDIRECT APIs
========================= */
app.post("/course-access", (req, res) => {

  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({ message: "Missing token" });
  }

  const { courseName } = req.body || {};

  if (!courseName) {
    return res.status(400).json({ message: "Course name is required" });
  }

  try {

    const payload = jwt.verify(token, SECRET);

    if (!payload.eligibleCourses?.includes(courseName)) {
      return res.status(403).json({ message: "Course not allowed" });
    }

    // Create short ticket
    const ticket = jwt.sign(
      {
        userId: payload.id,
        courseName
      },
      SECRET,
      { expiresIn: "30s" }
    );

    courseTickets.set(ticket, {
      used: false,
      expiresAt: Date.now() + 30 * 1000
    });

    res.json({
      launchUrl: `http://localhost:${PORT}/launch-course?ticket=${encodeURIComponent(ticket)}`
    });

  } catch (error) {

    return res.status(401).json({ message: "Invalid or expired token" });

  }
});


/* =========================
   LAUNCH COURSE
========================= */
app.get("/launch-course", (req, res) => {

  const { ticket } = req.query;

  if (!ticket) {
    return res.status(400).send("Invalid access link");
  }

  const record = courseTickets.get(ticket);

  if (!record) {
    return res.status(403).send("Access denied");
  }

  if (record.used || Date.now() > record.expiresAt) {

    courseTickets.delete(ticket);

    return res.status(403).send("This link is expired or already used");
  }

  record.used = true;

  setTimeout(() => {
    courseTickets.delete(ticket);
  }, 60 * 1000);


  /* =========================
     NEW PART: COURSE MAPPING
  ========================= */

  // Decode ticket
  const decoded = jwt.verify(ticket, SECRET);

  const courseName = decoded.courseName;

  // Map courses to files
  const coursePages = {

    java: "java-course.html",
    javascript: "js-course.html",
    android: "android-course.html",
    django: "django-course.html",
    html: "html-course.html",
    python: "python-course.html",
    react: "react-course.html",
    sql: "sql-course.html"

  };

  // Select page
  const courseFile = coursePages[courseName] || "index.html";

  // Build final URL
  const courseUrl = `${COURSE_SITE_BASE}/${courseFile}`;

  const safeCourseUrl = courseUrl.replace(/"/g, "&quot;");


  /* =========================
     IFRAME RESPONSE
  ========================= */

  return res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Course Player</title>

  <style>
    html, body {
      margin: 0;
      height: 100%;
      background: #0f172a;
    }

    iframe {
      width: 100%;
      height: 100%;
      border: 0;
    }
  </style>
</head>

<body>

  <iframe
    src="${safeCourseUrl}"
    referrerpolicy="no-referrer"
    allowfullscreen
  ></iframe>

</body>
</html>`);

});


/* =========================
   DEFAULT ROUTE
========================= */
app.get("/", (req, res) => {

  res.sendFile(
    path.join(__dirname, "public", "index.html")
  );

});


/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {

  console.log(`Government site running on http://localhost:${PORT}`);

});
