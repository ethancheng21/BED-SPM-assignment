// reminder.js

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let medications = [];
let notifiedTimes = new Set();
let reminderInterval;

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

// Fetch medications from backend (JWT-authenticated)
async function fetchGlobalMedications() {
  const token = localStorage.getItem("jwtToken");
  const userId = getUserIdFromToken();
  if (!token || !userId) return;

  try {
    const res = await fetch(`/api/medications/user`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const data = await res.json();
    medications = data.filter(med => med.schedule_time);

    console.log("Loaded medications:", medications);
  } catch (err) {
    console.error("Failed to fetch medications:", err);
  }
}

// Check for due reminders
function checkMedicationReminders() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeKey = `${hour}:${minute}`;

  if (notifiedTimes.has(timeKey)) return;
  notifiedTimes.add(timeKey);

  medications.forEach((med) => {
    const [medHour, medMinute] = med.schedule_time.split(":").map(Number);

    console.log(`Now: ${hour}:${minute.toString().padStart(2, '0')} | Med: ${medHour}:${medMinute}`);

    if (hour === medHour && minute === medMinute) {
      new Notification("Medication Reminder", {
        body: `Take ${med.name} (${med.dosage}) now`,
      });
    }
  });
}

// Start checking every 30 seconds
async function startGlobalReminders() {
  await fetchGlobalMedications();
  checkMedicationReminders();

  if (reminderInterval) clearInterval(reminderInterval);
  reminderInterval = setInterval(() => {
    checkMedicationReminders();
  }, 30000); // every 30 seconds

  setInterval(fetchGlobalMedications, 5 * 60 * 1000); // refresh meds every 5 mins
}

// Only start if logged in with token
if (localStorage.getItem("jwtToken")) {
  startGlobalReminders();
}