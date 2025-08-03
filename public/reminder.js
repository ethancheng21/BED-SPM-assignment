// reminder.js

if (Notification.permission !== "granted") {
  Notification.requestPermission();
}

let medications = [];
let notifiedTimes = new Set();
let reminderInterval;

// 🔁 Fetch medications from backend
async function fetchGlobalMedications() {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  try {
    const res = await fetch(`/api/medications/user/${userId}`);
    const data = await res.json();
    medications = data.filter(med => med.schedule_time); // skip broken entries

    console.log("📦 Loaded medications:", medications);
  } catch (err) {
    console.error("❌ Failed to fetch medications:", err);
  }
}

// ⏰ Check if any medication is due now
function checkMedicationReminders() {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const timeKey = `${hour}:${minute}`;

  console.log(`⏰ Current Time: ${hour}:${minute.toString().padStart(2, '0')}`);

  if (notifiedTimes.has(timeKey)) return;
  notifiedTimes.add(timeKey);

  medications.forEach((med) => {
    const [medHour, medMinute] = med.schedule_time.split(":").map(Number);
    console.log(`🔍 Checking med: ${med.name} at ${medHour}:${medMinute}`);

    if (hour === medHour && minute === medMinute) {
      console.log(`✅ Triggering notification for: ${med.name}`);
      new Notification("💊 Medication Reminder", {
        body: `Take ${med.name} (${med.dosage}) now`
      });
    }
  });

  console.log("——————");
}

// 🔄 Start checking every 30 seconds
async function startGlobalReminders() {
  await fetchGlobalMedications();
  checkMedicationReminders();

  if (reminderInterval) clearInterval(reminderInterval);
  reminderInterval = setInterval(() => {
    checkMedicationReminders();
  }, 30000); // every 30 seconds

  // Optional: refresh med list every 5 minutes
  setInterval(fetchGlobalMedications, 5 * 60 * 1000);
}

// Only run if user is logged in
if (localStorage.getItem("userId")) {
  startGlobalReminders();
}
