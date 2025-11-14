const SUPABASE_URL = "https://pijsxjlqxeqanknogalx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpanN4amxxeGVxYW5rbm9nYWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ3MjUsImV4cCI6MjA3NzA5MDcyNX0.-UTF0fw7eBQZFlFK5H9FPy6FCiAwDBjj3oAM-lXfyEg";

function speciesLabel(value) {
  if (value === 0 || value === "0") return "Dog";
  if (value === 1 || value === "1") return "Cat";
  if (typeof value === "string" && value.trim() !== "") return value;
  return "";
}

function genderLabel(value) {
  if (value === 0 || value === "0") return "Male";
  if (value === 1 || value === "1") return "Female";
  return "";
}

function genderLabelFromRecord(rec) {
  const g = rec?.gender;
  if (g === 0 || g === "0") return "male";
  if (g === 1 || g === "1") return "female";
  if (typeof g === "string" && g.trim()) return g.toLowerCase();
  return "";
}

function speciesLabelFromRecord(rec) {
  return rec?.animal === 0 || rec?.animal === "0"
    ? "dog"
    : rec?.animal === 1 || rec?.animal === "1"
    ? "cat"
    : typeof rec?.animal === "string"
    ? rec.animal.toLowerCase()
    : "";
}

function ageLabelFromRecord(rec) {
  if (typeof rec?.age === "string" && rec.age.trim()) return rec.age.toLowerCase();
  const m = { "0": "baby", "1": "young", "2": "adult", "3": "elderly" };
  const k = rec?.agegroup != null ? String(rec.agegroup) : "";
  return m[k] || "";
}

function activityLabelFromRecord(rec) {
  const m = { "0": "low", "1": "medium", "2": "high" };
  const k = rec?.activitylevel != null ? String(rec.activitylevel) : "";
  return m[k] || (typeof rec?.activity_level === "string" ? rec.activity_level.toLowerCase() : "");
}

function passesFilters(rec, ui) {
  if (ui.species  && speciesLabelFromRecord(rec)      !== ui.species)   return false;
  if (ui.age      && ageLabelFromRecord(rec)          !== ui.age)       return false;
  if (ui.activity && activityLabelFromRecord(rec)     !== ui.activity)  return false;
  if (ui.gender   && genderLabelFromRecord(rec)       !== ui.gender)    return false;
  return true;
}

function onImgError(e) {
  const img = e.currentTarget;
  img.alt = "";
  img.onerror = null;
  img.src = "img/dog1.jpg";
}

function nonEmpty(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  return true;
}

function getImageSrc(animal) {
  if (nonEmpty(animal.image_url)) return animal.image_url;
  if (nonEmpty(animal.image)) return animal.image;
  return "img/default.jpg";
}

function buildDetailHref(id) {
    return "animaldetail.html?id=" + encodeURIComponent(String(id));
}  

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('animal-detail-container');
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));
    if (Number.isFinite(id) && id > 0) {
      displayAnimalDetails(id);
    } else {
      container.innerHTML = '<h1>Animal Not Found</h1><p>No animal ID was provided in the URL.</p>';
    }
  });
  window.displayAnimalDetails = displayAnimalDetails;
  window.loadAnimals = loadAnimals;
  
  

function getFilters() {
  const species  = (document.getElementById("Animal")?.value || "").toLowerCase();
  const age      = (document.getElementById("Age")?.value || "").toLowerCase();
  const activity = (document.getElementById("Activity-Level")?.value || "").toLowerCase();
  const gender   = (document.getElementById("Gender")?.value || "").toLowerCase();
  return { species, age, activity, gender };
}

function attachFilterListeners() {
  ["Animal", "Age", "Activity-Level", "Gender"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => loadAnimals());
  });
}
window.attachFilterListeners = attachFilterListeners;

function goBack() {
  if (history.length > 1) history.back();
  else window.location.href = "adopt.html";
}
window.goBack = goBack;

async function loadAnimals() {
  const tiles = document.getElementById("tiles");
  if (!tiles) return;
  tiles.innerHTML = "<p>Loading…</p>";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from("animals").select("*").order("id", { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
    tiles.innerHTML = `<p class="error">Could not load animals. ${error.message}</p>`;
    return;
  }

  const ui = getFilters();
  const filtered = (data || []).filter((rec) => passesFilters(rec, ui));

  tiles.innerHTML = "";
  if (filtered.length === 0) {
    tiles.innerHTML = "<p>No animals match your filters right now.</p>";
    return;
  }

  filtered.forEach((animal) => {
    const a = document.createElement("a");
    a.className = "animal";
    a.href = buildDetailHref(animal.id);

    const img = document.createElement("img");
    img.src = animal.image_url || animal.image || "img/default.jpg";
    img.alt = "";
    img.onerror = onImgError;

    const h3 = document.createElement("h3");
    h3.textContent = animal.name || "Adoptable Animal";

    const p = document.createElement("p");
    const bits = [];

    const ageTxt = ageLabelFromRecord(animal);
    if (ageTxt) bits.push(ageTxt);

    const sp = speciesLabelFromRecord(animal);
    if (sp) bits.push(sp);

    const gTxt = genderLabel(animal.gender);
    if (gTxt) bits.push(gTxt);

    const actTxt = activityLabelFromRecord(animal);
    if (actTxt) bits.push(`${actTxt} activity`);

    if (bits.length) p.textContent = bits.join(" · ");

    a.appendChild(img);
    a.appendChild(h3);
    if (bits.length) a.appendChild(p);

    tiles.appendChild(a);
  });
}

async function addAnimal(event) {
  event.preventDefault();

  const id = parseInt(document.getElementById("Id").value);
  const animal = parseInt(document.getElementById("Animal").value);
  const name = document.getElementById("Name").value;
  const age_group = parseInt(document.getElementById("AgeGroup").value);
  const gender = parseInt(document.getElementById("Gender").value);
  const in_foster = parseInt(document.getElementById("InFoster").value);
  const intake_date = document.getElementById("IntakeDate").value;
  const activity_level = parseInt(document.getElementById("ActivityLevel").value);
  const size = parseInt(document.getElementById("Size").value);

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  const { data, error } = await supabase.from("animals").insert([
    { id, animal, name, agegroup: age_group, gender, infoster: in_foster, intakedate: intake_date, activitylevel: activity_level, size }
  ]);

  const optional_strings = ["age", "description", "goodwith", "personality", "health", "breed", "weight"];

  const newData = { id };
  for (let i = 0; i < optional_strings.length; i++) {
    const field = optional_strings[i];
    try {
      const form_input = document.getElementById(field).value;
      if (form_input) newData[field] = form_input;
    } catch (e) {}
  }

  const { _, optional_error } = await supabase.from("animals").upsert(newData).select();

  if (error) {
    console.error("Insert failed:", error);
    alert("Insert failed: " + error.message);
  } else {
    console.log("Inserted:", data);
    alert("Animal added successfully!");
  }

  if (optional_error) {
    console.error("Optional Data Error:", optional_error);
    alert("Optional Data Error: " + optional_error.message);
  }
}

async function loadAnimal(id) {
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from("animals").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching animal details:", error);
    return null;
  }
  return data;
}

function labeledRow(label, value) {
  if (!nonEmpty(value)) return "";
  return `<p><strong>${label}:</strong> ${value}</p>`;
}

async function displayAnimalDetails(id) {
  const container = document.getElementById("animal-detail-container");
  if (!container) return;
  try {
    container.innerHTML = "";
    const animal = await loadAnimal(id);
    if (!animal) {
      container.innerHTML = "<h1>Animal Not Found</h1><p>Could not retrieve data for this animal.</p>";
      return;
    }
    const name = animal.name || "Adoptable Animal";
    const imgSrc = getImageSrc(animal);
    container.innerHTML = `
      <div class="animal-detail">
        <img src="${imgSrc}" alt="${name}" style="max-width: 400px; width: 100%; height: auto;">
        <h1>${name}</h1>
        ${labeledRow("Species", speciesLabelFromRecord(animal))}
        ${labeledRow("Age", animal.age)}
        ${labeledRow("Gender", genderLabel(animal.gender))}
        ${labeledRow("Activity Level", activityLabelFromRecord(animal))}
        ${labeledRow("Description", animal.description)}
      </div>
    `;
  } catch (err) {
    console.error("Detail render error:", err);
    container.innerHTML = `<p class="error">Could not render details.</p>`;
  }
}