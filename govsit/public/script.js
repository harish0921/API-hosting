// Wait until page loads
document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // LOGIN PAGE
  // ===============================
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {

    const messageBox = document.getElementById("messageBox");

    loginForm.addEventListener("submit", async function (e) {

      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {

        const response = await fetch("/login", {

          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({ username, password })

        });

        const data = await response.json();

        if (response.ok) {

          localStorage.setItem("govToken", data.token);

          messageBox.innerHTML = "Login successful!";
          messageBox.style.color = "green";

          setTimeout(() => {
            window.location.href = "courses.html";
          }, 1000);

        } else {

          messageBox.innerHTML = data.message;
          messageBox.style.color = "red";

        }

      } catch (error) {

        console.error("Login error:", error);

        messageBox.innerHTML = "Server error";
        messageBox.style.color = "red";

      }
    });
  }


  // ===============================
  // COURSES PAGE
  // ===============================
  const courseList = document.getElementById("courseList");

  if (courseList) {

    const token = localStorage.getItem("govToken");

    if (!token) {

      alert("Please login first.");

      window.location.href = "login.html";
      return;
    }


    /* ===============================
       SAFE TOKEN DECODE
    =============================== */
    let payload;

    try {

      payload = JSON.parse(atob(token.split(".")[1]));

    } catch (err) {

      console.error("Invalid token");

      localStorage.removeItem("govToken");
      window.location.href = "login.html";
      return;

    }

    const courses = payload.eligibleCourses || [];

    courseList.innerHTML = "";

    if (courses.length === 0) {

      courseList.innerHTML = "<li>No courses assigned.</li>";
      return;

    }

    courses.forEach(course => {

      const li = document.createElement("li");

      li.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; padding:10px 0;">
          <span><strong>${course.toUpperCase()} Course</strong></span>
          <button onclick="watchCourse('${course}')" class="watch-btn">
            Watch
          </button>
        </div>
      `;

      courseList.appendChild(li);

    });
  }

});


// ===============================
// WATCH COURSE
// ===============================
async function watchCourse(courseName) {

  const token = localStorage.getItem("govToken");

  if (!token) {

    alert("Please login first.");

    window.location.href = "login.html";
    return;

  }

  try {

    const response = await fetch("/course-access", {

      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },

      body: JSON.stringify({ courseName })

    });

    const data = await response.json();

    if (!response.ok) {
      // If token expired, redirect to login
      if (response.status === 401) {
        localStorage.removeItem("govToken");
        alert("Session expired. Please login again.");
        window.location.href = "/login.html";
        return;
      }
      alert(data.message || "Unable to open course right now.");
      return;
    }

    // 🔹 Redirect to secure launch URL
    if (data.launchUrl) {
      window.location.href = data.launchUrl;
    } else {
      alert("Invalid response from server.");
    }

  } catch (error) {

    console.error("Course launch error:", error);

    alert("Server error while opening course.");

  }
}


// ===============================
// LOGOUT
// ===============================
function logout() {

  localStorage.removeItem("govToken");

  window.location.href = "login.html";

}
