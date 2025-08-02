const userId = localStorage.getItem("userId");
if (!userId) {
  alert("Please login first.");
  window.location.href = "/auth.html";
}
const form = document.getElementById("medForm");
const medList = document.getElementById("medList");

async function fetchMeds() {
  const res = await fetch(`/api/medications/user/${userId}`);
  const meds = await res.json();
  medList.innerHTML = "";

  meds.forEach((med) => {
  const iso = med.schedule_time; // "1970-01-01T07:50:00.000Z"
  const timePart = new Date(iso).toISOString().split("T")[1].split(":"); // ["07", "50", "00.000Z"]
  const [hours, minutes] = timePart;

  const hourNum = parseInt(hours, 10);
  const ampm = hourNum >= 12 ? 'PM' : 'AM';
  const hour12 = hourNum % 12 || 12;
  const formattedTime = `${hour12}:${minutes} ${ampm}`;

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${med.name}</strong> — ${med.dosage} at ${formattedTime}
    <br>${med.instructions || ""}
    <br><button onclick="deleteMed(${med.medication_id})">Delete</button>
  `;
  medList.appendChild(li);
});
}

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
    fetchMeds();
  } else {
    alert("Failed to add medication.");
  }
});

async function deleteMed(id) {
  const res = await fetch(`/api/medications/${id}`, { method: "DELETE" });
  if (res.ok) fetchMeds();
}

fetchMeds();


function logout() {
  localStorage.removeItem("userId");
  window.location.href = "home.html"; // Redirect to public version
}