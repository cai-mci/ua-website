
//LOADING
function buildDetailHref(id) {
    return "animaldetail.html?id=" + encodeURIComponent(String(id));
}  


async function loadAnimals() {
  const tiles = document.getElementById("tiles");
    if (!tiles) return; // Stop if the tile container is missing
    tiles.innerHTML = "<p>Loading…</p>"; // Show loading message

    let data;
    try {
        const response = await fetch('/view/animals'); 
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        responseData = await response.json();
        data = responseData.data 

    } catch (fetchError) {
        console.error("Fetch error:", fetchError);
        tiles.innerHTML = `<p class="error">Could not load animals. Check the server is running.</p>`;
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



//image loading errors
function onImgError(e) {
  const img = e.currentTarget;
  img.alt = "";
  img.onerror = null;
  img.src = "img/dog1.jpg";
}



//check if a value is not null, undefined, or an empty string



//FILTERING

//user interface filters (values from dropdowns)
function passesFilters(rec, ui) {
  if (ui.species.toLowerCase()  && rec?.animal.toLowerCase()    !== ui.species)   return false;
  if (ui.age.toLowerCase()      && rec?.agegroup.toLowerCase()          !== ui.age)       return false;
  if (ui.activity.toLowerCase() && rec?.activitylevel.toLowerCase()     !== ui.activity)  return false;
  if (ui.gender.toLowerCase()   && rec?.gender.toLowerCase()       !== ui.gender)    return false;
  return true;
}


//Reads the current values from the HTML filter dropdowns and returns them as lowercase/ui object
function getFilters() {
  const species  = (document.getElementById("Animal")?.value || "").toLowerCase();
  const age      = (document.getElementById("Age")?.value || "").toLowerCase();
  const activity = (document.getElementById("ActivityLevel")?.value || "").toLowerCase();
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

