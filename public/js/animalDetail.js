
import {getImageSrc, labeledRow} from './utils.js';

//detail functions

async function loadAnimal(id) {
    try {

        const response = await fetch(`/api/animal/${id}`); 

        if (response.status === 404) return null;
        if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
        return await response.json();

    } catch (error) {
        console.error("Error fetching animal details from server:", error);
        return null;
    }
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

