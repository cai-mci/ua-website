// --- Constants from supabase project ---
const SUPABASE_URL = "https://pijsxjlqxeqanknogalx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpanN4amxxeGVxYW5rbm9nYWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ3MjUsImV4cCI6MjA3NzA5MDcyNX0.-UTF0fw7eBQZFlFK5H9FPy6FCiAwDBjj3oAM-lXfyEg";

    //  0/1 → Dog/Cat
function speciesLabel(value) {
    if (value === 0 || value === "0") return "Dog";
    if (value === 1 || value === "1") return "Cat";
    if (typeof value === "string" && value.trim() !== "") return value;
    return "";
  }
  
  function onImgError(e) {
    const img = e.currentTarget;
    img.alt = ""; 
    img.onerror = null; 
    img.src = "img/dog1.jpg"; 
  }
  

function attachFilterListeners() {
    ["Animal", "Age", "Activity-Level"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => loadAnimals());
    });
  }
  window.attachFilterListeners = attachFilterListeners;
  

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
    const base = window.location.href.replace(/[^/]*$/, ""); // drop current filename
    const url = new URL("animaldetail.html", base);
    url.searchParams.set("id", id);
    return url.toString();
  }
  
  // filters
  function getFilters() {
    const species = document.getElementById("Animal")?.value?.trim() || "";
    const age = document.getElementById("Age")?.value?.trim() || "";
    const activity = document.getElementById("Activity-Level")?.value?.trim() || "";
    return { species, age, activity };
  }
  
  // dropdowns to reload list
  function attachFilterListeners() {
    ["Animal", "Age", "Activity-Level"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.addEventListener("change", () => loadAnimals());
    });
  }
  window.attachFilterListeners = attachFilterListeners;
  
  // Back button 
  function goBack() {
    if (history.length > 1) history.back();
    else window.location.href = "adopt.html";
  }
  window.goBack = goBack;

function speciesLabelFromRecord(rec) {
    return speciesLabel(rec?.animal); // your DB field is `animal` (0=Dog, 1=Cat)
  }
  
  
// --- Main function to load and display all animal tiles (for adopt.html) --

async function loadAnimals() {
    const tiles = document.getElementById("tiles");
    if (!tiles) return;
    tiles.innerHTML = "<p>Loading…</p>";
  
    const speciesFilter = (document.getElementById("Animal")?.value || "").toLowerCase();   // "" | "dog" | "cat"
    const ageFilter = (document.getElementById("Age")?.value || "").toLowerCase();          // "", "baby", ...
    const activityFilter = (document.getElementById("Activity-Level")?.value || "").toLowerCase();

    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    const { data, error } = await supabase.from("animals").select("*").order("id", { ascending: true });
  
    if (error) {
      console.error("Fetch error:", error);
      tiles.innerHTML = `<p class="error">Could not load animals. ${error.message}</p>`;
      return;
    }
  

    let filtered = (data || []).filter((rec) => {
      // species
      if (speciesFilter) {
        const label = speciesLabelFromRecord(rec).toLowerCase();
        if (label !== speciesFilter) return false;
      }
      // age (best-effort: match substring; works for "adult", "young", "2 years", etc.)
      if (ageFilter) {
        const ageStr = (rec.age || "").toString().toLowerCase();
        if (!ageStr.includes(ageFilter)) return false;
      }
      // activity level (substring match)
      if (activityFilter) {
        const act = (rec.activitylevel || "").toString().toLowerCase();
        if (!act.includes(activityFilter)) return false;
      }
      return true;
    });
  
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
      img.src = (animal.image_url || animal.image || "img/default.jpg");
      img.alt = "";            // prevent duplicate text when image 404s
      img.onerror = onImgError;
  
      const h3 = document.createElement("h3");
      h3.textContent = animal.name || "Adoptable Animal";
  
      const p = document.createElement("p");
      const bits = [];
  
      if (nonEmpty(animal.age)) bits.push(animal.age);
  

      const sp = speciesLabelFromRecord(animal);
      if (sp) bits.push(sp);
 
      if (nonEmpty(animal.gender) && isNaN(animal.gender)) bits.push(animal.gender);
  
      if (nonEmpty(animal.activity_level)) bits.push(`${animal.activity_level} activity`);
  
      if (bits.length) p.textContent = bits.join(" · ");
  
      a.appendChild(img);
      a.appendChild(h3);
      if (bits.length) a.appendChild(p);
  
      tiles.appendChild(a);
    });
  }
  



async function addAnimal(event) {
    event.preventDefault();

    // mandatory
    const id = parseInt(document.getElementById('Id').value);
    const animal = parseInt(document.getElementById('Animal').value);
    const name = document.getElementById('Name').value;
    const age_group = parseInt(document.getElementById('AgeGroup').value);
    const gender = parseInt(document.getElementById('Gender').value);
    const in_foster = parseInt(document.getElementById('InFoster').value);
    const intake_date = document.getElementById('IntakeDate').value;
    const activity_level = parseInt(document.getElementById('ActivityLevel').value);
    const size = parseInt(document.getElementById('Size').value);
    
    

    // TODO: parse date
    // const intake_date = document.getElementById('age').value; 

    //initialize supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    //query the database to get all the data from the animals table
    const { data, error } = await supabase.from('animals').insert([{
        id: id,
        animal: animal,
        name: name,
        agegroup: age_group,
        gender: gender,
        infoster: in_foster,
        intakedate: intake_date,
        activitylevel: activity_level,
        size: size,
    }]);



    const newData = {
        id: id, 
    };
    //for each field
    for (i = 0; i < optional_strings.length; i++) {
        field = optional_strings[i];
        console.log('Field:', field);

        try {
            //get input from the form
            const form_input = document.getElementById(field).value;
            if (form_input) {
                console.log('Worked');
                //add that to newData
                newData[field] = form_input;
            } else {
                console.log('Did not work');
            }

        } catch (e) {
            // alert("catch:" + e);
        }
    }

    console.log(newData)
    const { _, optional_error } = await supabase
        .from('animals')
        .upsert(newData)
        .select()

    //error handling
        //missiing a NOT NULL field
        //duplicate id
    
    //TODO add auto increment ID
    if (error) {
        console.error('Insert failed:', error);
        alert('Insert failed: ' + error.message);
    } else {
        console.log('Inserted:', data);
        alert('Animal added successfully!');
    }

    if (optional_error) {
        console.error('Optional Data Error:', optional_error);
        alert('Optional Data Error: ' + optional_error.message);
    } 
}
// --- loadAnimal function (for animaldetail.html) ---
async function loadAnimal(id) {
    //initialize supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Query the database for a single animal
    const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching animal details:", error);
        return null;
    } 
    return data;
}

// --- displayAnimalDetails function (for animaldetail.html) ---
function labeledRow(label, value) {
    if (!nonEmpty(value)) return "";
    return `<p><strong>${label}:</strong> ${value}</p>`;
  }
  
  // --- displayAnimalDetails (REPLACED) ---
  async function displayAnimalDetails(id) {
    const animal = await loadAnimal(id);
    const container = document.getElementById('animal-detail-container');
    if (!container) return;
  
    container.innerHTML = "";
  
    if (!animal) {
      container.innerHTML = '<h1>Animal Not Found</h1><p>Could not retrieve data for this animal.</p>';
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
        ${labeledRow("Gender", animal.gender)}
        ${labeledRow("Activity Level", animal.activitylevel)}
        ${labeledRow("Description", animal.description)}
      </div>
    `;
  }
  
