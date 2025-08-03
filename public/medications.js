// Extract userId from JWT
function getUserIdFromToken() {
  const token = localStorage.getItem("jwtToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId;
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

const token = localStorage.getItem("jwtToken");
const userId = getUserIdFromToken();

if (!token || !userId) {
  alert("Please login first.");
  window.location.href = "/auth.html";
}

const form = document.getElementById("medForm");
const medList = document.getElementById("medList");

<<<<<<< HEAD
// Request notification permission once
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let medications = [];
let notifiedTimes = new Set();

// Load and display medication list
async function fetchMeds() {
  try {
    const res = await fetch("/api/medications/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const meds = await res.json();
    medList.innerHTML = "";

    meds.forEach((med) => {
      if (!med.schedule_time) return;

      const [hour, minute] = med.schedule_time.split(":").map(Number);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      const formattedTime = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;

      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${med.name}</strong> — ${med.dosage} at ${formattedTime}
        <br>${med.instructions || ""}
        <br><button onclick="deleteMed(${med.medication_id})">Delete</button>
      `;
      medList.appendChild(li);
    });

    medications = meds; // cache for reminders
  } catch (err) {
    console.error("Error loading medications:", err);
    alert("Unable to load medications.");
  }
}

// Add new medication
=======
if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let medications = [];
let notifiedTimes = new Set();

// Display meds on page
async function fetchMeds() {
  const res = await fetch(`/api/medications/user/${userId}`);
  const meds = await res.json();
  medList.innerHTML = "";

  meds.forEach((med) => {
    if (!med.schedule_time) {
      console.warn("Missing schedule_time for medication:", med);
      return;
    }

    const [hour, minute] = med.schedule_time.split(":").map(Number);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    const formattedTime = `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${med.name}</strong> — ${med.dosage} at ${formattedTime}
      <br>${med.instructions || ""}
      <br><button onclick="deleteMed(${med.medication_id})">Delete</button>
    `;
    medList.appendChild(li);
  });
}

// Submit new medication
>>>>>>> f1f7bae080ad8dcb32473c6d294689ba3a44d09d
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    user_id: userId,
    name: document.getElementById("name").value,
    dosage: document.getElementById("dosage").value,
    schedule_time: document.getElementById("schedule_time").value,
    instructions: document.getElementById("instructions").value,
  };

  try {
    const res = await fetch("/api/medications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

<<<<<<< HEAD
    if (res.ok) {
      form.reset();
      await fetchMeds();
    } else {
      alert("Failed to add medication.");
    }
  } catch (err) {
    console.error("Submit error:", err);
    alert("Error adding medication.");
=======
  if (res.ok) {
    form.reset();
    startReminders(); // refresh meds list + cache
  } else {
    alert("Failed to add medication.");
>>>>>>> f1f7bae080ad8dcb32473c6d294689ba3a44d09d
  }
});

// Delete medication
async function deleteMed(id) {
<<<<<<< HEAD
  try {
    const res = await fetch(`/api/medications/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchMeds();
    else alert("Failed to delete medication.");
  } catch (err) {
    console.error("Delete error:", err);
    alert("Error deleting medication.");
  }
}

// Notification checker
=======
  const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
  if (res.ok) startReminders();
}

// Check reminders
>>>>>>> f1f7bae080ad8dcb32473c6d294689ba3a44d09d
function checkMedicationReminders(meds) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const timeKey = `${currentHour}:${currentMinute}`;
<<<<<<< HEAD

  if (notifiedTimes.has(timeKey)) return;
  notifiedTimes.add(timeKey);

  meds.forEach((med) => {
    const [medHour, medMinute] = med.schedule_time.split(":").map(Number);

    // Debug logs
    console.log(`🔍 Now: ${currentHour}:${currentMinute}`);
    console.log(`💊 Med: ${medHour}:${medMinute}`);
    console.log("---");

    if (currentHour === medHour && currentMinute === medMinute) {
      const msg = `💊 Reminder: Take ${med.name} (${med.dosage}) now`;
      if (Notification.permission === "granted") {
        new Notification("Medication Reminder", { body: msg });
      }
    }
  });
}

// Start background check
fetchMeds();
setInterval(() => {
  checkMedicationReminders(medications);
}, 30000);

// Logout
function logout() {
  localStorage.removeItem("jwtToken");
  window.location.href = "home.html";
}
=======

  if (notifiedTimes.has(timeKey)) return;
  notifiedTimes.add(timeKey);

  meds.forEach((med) => {
    const [medHour, medMinute] = med.schedule_time.split(":").map(Number);

    // Debug logs
    console.log(`🔍 Now: ${currentHour}:${currentMinute}`);
    console.log(`💊 Med: ${medHour}:${medMinute}`);
    console.log("---");

    if (currentHour === medHour && currentMinute === medMinute) {
      const msg = `💊 Reminder: Take ${med.name} (${med.dosage}) now`;
      if (Notification.permission === "granted") {
        new Notification("Medication Reminder", { body: msg });
      }
    }
  });
}

// Load and start
async function startReminders() {
  const res = await fetch(`/api/medications/user/${userId}`);
  medications = await res.json();
  fetchMeds();
}

startReminders();
setInterval(() => {
  checkMedicationReminders(medications);
}, 30000);

function logout() {
  localStorage.removeItem("userId");
  window.location.href = "home.html";
}
>>>>>>> f1f7bae080ad8dcb32473c6d294689ba3a44d09d
