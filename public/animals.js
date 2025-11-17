// // server.js
// const express = require('express');
// const app = express();


// const { createClient } = require('@supabase/supabase-js');
// const dotenv = require('dotenv');
// dotenv.config();
// const SUPABASE_URL = process.env.SUPABASE_URL;
// const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

const SUPABASE_URL = "https://pijsxjlqxeqanknogalx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpanN4amxxeGVxYW5rbm9nYWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ3MjUsImV4cCI6MjA3NzA5MDcyNX0.-UTF0fw7eBQZFlFK5H9FPy6FCiAwDBjj3oAM-lXfyEg";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  

//user interface filters (values from dropdowns)
function passesFilters(rec, ui) {
  if (ui.species.toLowerCase()  && rec?.animal.toLowerCase()    !== ui.species)   return false;
  if (ui.age.toLowerCase()      && rec?.agegroup.toLowerCase()          !== ui.age)       return false;
  if (ui.activity.toLowerCase() && rec?.activitylevel.toLowerCase()     !== ui.activity)  return false;
  if (ui.gender.toLowerCase()   && rec?.gender.toLowerCase()       !== ui.gender)    return false;
  return true;
}


//image loading errors
function onImgError(e) {
  const img = e.currentTarget;
  img.alt = "";
  img.onerror = null;
  img.src = "img/dog1.jpg";
}

//check if a value is not null, undefined, or an empty string
function nonEmpty(v) {
  if (v === null || v === undefined) return false;
  if (typeof v === "string" && v.trim() === "") return false;
  return true;
}

//determines best animal image source
function getImageSrc(animal) {
  if (nonEmpty(animal.image_url)) return animal.image_url;
  if (nonEmpty(animal.image)) return animal.image;
  return "img/default.jpg";
}

//creates url for animal detail page
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

  //Export functions globally so they can be called from the HTML scripts
  window.displayAnimalDetails = displayAnimalDetails;
  window.loadAnimals = loadAnimals;
  
  
//Reads the current values from the HTML filter dropdowns and returns them as lowercase/ui object
function getFilters() {
  const species  = (document.getElementById("Animal")?.value || "").toLowerCase();
  const age      = (document.getElementById("Age")?.value || "").toLowerCase();
  const activity = (document.getElementById("Activity-Level")?.value || "").toLowerCase();
  const gender   = (document.getElementById("Gender")?.value || "").toLowerCase();
  return { species, age, activity, gender };
}

//attaches to filter dropwdowns
function attachFilterListeners() {
  ["Animal", "Age", "Activity-Level", "Gender"].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("change", () => loadAnimals());
  });
}
window.attachFilterListeners = attachFilterListeners;

//browser back button
function goBack() {
  if (history.length > 1) history.back();
  else window.location.href = "adopt.html";
}
window.goBack = goBack;

async function loadAnimals() {
  const tiles = document.getElementById("tiles");
  if (!tiles) return; // Stop if the tile container is missing
  tiles.innerHTML = "<p>Loading…</p>"; // Show loading message

  // Fetch all animal records
  const { data, error } = await supabase.from("animals").select("*").order("id", { ascending: true });

  //handle fetch errors likle connection issue)\
  if (error) {
    console.error("Fetch error:", error);
    tiles.innerHTML = `<p class="error">Could not load animals. ${error.message}</p>`;
    return;
  }

  //Get current filter settings
  const ui = getFilters();
  
  // ffilter the data using the passesFilters function
  const filtered = (data || []).filter((rec) => passesFilters(rec, ui));

  //  Handle no results
  tiles.innerHTML = "";
  if (filtered.length === 0) {
    tiles.innerHTML = "<p>No animals match your filters right now.</p>";
    return;
  }

  // Loop through filtered data and build HTML tiles
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
    const bits = []; // Array to hold descriptive text parts age aan d species

    // Build descriptive text 
    const ageTxt = animal.age;
    if (ageTxt) bits.push(ageTxt);

    const sp = animal.animal;
    if (sp) bits.push(sp);

    const gTxt = animal.gender;
    if (gTxt) bits.push(gTxt);

    const actTxt = animal.activity_level;
    if (actTxt) bits.push(`${actTxt} activity`);

    if (bits.length) p.textContent = bits.join(" · ");

    // Append all parts to the tile link
    a.appendChild(img);
    a.appendChild(h3);
    if (bits.length) a.appendChild(p);

    // Append the completed tile to the container
    tiles.appendChild(a);
  });
}

//detail functions
async function loadAnimal(id) {
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from("animals").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching animal details:", error);
    return null;
  }
  return data;
}


//create 1 single row for details page
function labeledRow(label, value) {
  if (!nonEmpty(value)) return "";
  return `<p><strong>${label}:</strong> ${value}</p>`;
}


//renders view for 1 single animal
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
        ${labeledRow("Species", animal.animal)}
        ${labeledRow("Age", animal.age)}
        ${labeledRow("Gender", animal.gender)}
        ${labeledRow("Activity Level", animal.activity_level)}
        ${labeledRow("Description", animal.description)}
      </div>
    `;
  } catch (err) {
    console.error("Detail render error:", err);
    container.innerHTML = `<p class="error">Could not render details.</p>`;
  }
}