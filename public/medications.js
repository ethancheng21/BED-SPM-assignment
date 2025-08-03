const userId = localStorage.getItem("userId");
if (!userId) {
  alert("Please login first.");
  window.location.href = "/auth.html";
}

const form = document.getElementById("medForm");
const medList = document.getElementById("medList");

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
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    user_id: userId,
    name: document.getElementById("name").value,
    dosage: document.getElementById("dosage").value,
    schedule_time: document.getElementById("schedule_time").value,
    instructions: document.getElementById("instructions").value,
  };

  const res = await fetch("/api/medications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (res.ok) {
    form.reset();
    startReminders(); // refresh meds list + cache
  } else {
    alert("Failed to add medication.");
  }
});

// Delete medication
async function deleteMed(id) {
  const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
  if (res.ok) startReminders();
}

// Check reminders
function checkMedicationReminders(meds) {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const timeKey = `${currentHour}:${currentMinute}`;

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
