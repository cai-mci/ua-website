const { supabase } = require('../../server/database.js');
const {getImageSrc, labeledRow} = require('utils.js')

//creates url for animal detail page

//detail functions
async function loadAnimal(id) {
  const { data, error } = await supabase.from("animals").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching animal details:", error);
    return null;
  }
  return data;
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


module.exports = {
    loadAnimal,
    displayAnimalDetails,
};


document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('animal-detail-container');
    if (!container) return;
    const params = new URLSearchParams(window.location.search);
    const id = Number(params.get('id'));

    if (Number.isFinite(id) && id > 0) {
      // Assuming this function is defined and handles the data fetching/rendering
      displayAnimalDetails(id); 
    } else {
      container.innerHTML = '<h1>Animal Not Found</h1><p>No animal ID was provided in the URL.</p>';
    }
});

