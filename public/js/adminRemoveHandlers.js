import { loadAnimalsFromAPI } from './adminHandlers.js';
import { loadAnimal } from "./animalDetail.js";


let selectedAnimalId = null;


export async function getSelectedID() {
    return selectedAnimalId;
}
export async function setSelectedID(id) {
    selectedAnimalId = id;
}

export async function adoptAnimal(id) {
    const url = "/animals/"+ id + "/adopt"

    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        if (response.ok) {
            console.log("Animal modified successfully");
            alert("Animal is no longer listed on site");
            loadAndShow();

            hideModal();
            return true;
        } else {
            console.error("Server update error:", result.message || "Unknown error");
            alert('Error modifying animal.');
            
            hideModal();
            return false;
        }

    } catch (error) {
        console.error(error);
        alert("Error: Could not reach the server.");
        return false;
    }

}



//use this in html
export async function loadAndShow() {
    let animals;
    try {
    const rawAnimalData = await loadAnimalsFromAPI();
    animals = await rawAnimalData.filter(a => a.adoptable === true);
    showAnimalList(animals);
    } catch (error) {
        console.error("Error loading animal list:", error);

        const listBox = document.getElementById("animal-list");
        if (listBox) {
            listBox.innerHTML = `<p class="error p-2">Failed to load animal</p>`;
        }
    }
    return animals;


}

function showAnimalList(animalToShow) {
  const listBox = document.getElementById("animal-list");
  listBox.innerHTML = "";

  animalToShow.forEach((animal) => {
    const box = document.createElement("div");
    box.className = "animal-list-item";
    box.innerHTML = `
      <span class="animal-id">${animal.id}</span>
      <span class="animal-name">${animal.name || "(no name)"}</span>
    `;

    box.addEventListener("click", () => {
      // highlight selected
      document.querySelectorAll(".animal-list-item")
        .forEach((i) => i.classList.remove("selected"));
      box.classList.add("selected");

      console.log("selected: " , animal.id)
      selectedAnimalId = animal.id;

      // update modal text
      const modalName = document.getElementById("modal-animal-name");
      if (modalName) {
        modalName.textContent = animal.name || ("Animal " + animal.id);
      }

      // load details on the right
      loadPreview(animal.id);
    });

    listBox.appendChild(box);
  });
}

// preview card
export async function loadPreview(id) {
  const container = document.getElementById("animal-detail-container");
  if (!container) {
    console.log("couldn't find container")
    return;
  }

  if (id == -1) {
    container.innerHTML = `
        <div id="animal-detail-container" class="animal-detail-card">
        <p>Select an animal on the left to see its details.</p>
        </div>
    `;

  }
  //get animal 
  const animal = await loadAnimal(id);
  //error handing!!
  if (!animal) {
    container.innerHTML = `
        <div id="animal-detail-container" class="animal-detail-card">
        <p>Select an animal on the left to see its details.</p>
        </div>
    `;
  }

  const default_img = "/animal/" + animal.animal + ".png";
  const imgSrc = animal.image_url && animal.image_url.trim()
    ? animal.image_url
    : default_img;


  container.innerHTML = `
    <div class="animal-detail">
      <img src="${imgSrc}" alt=${animal.name ||  "No Name"} class="detail-image">
      <h3>${animal.name || "No Name"}</h3>
      <p><strong>Type:</strong> ${animal.animal || ""}</p>
      <p><strong>Age:</strong> ${animal.age || animal.agegroup || ""}</p>
      <p><strong>Gender:</strong> ${animal.gender || ""}</p>
      <p><strong>Activity Level:</strong> ${animal.activitylevel || animal.activity_level || ""}</p>
      <p><strong>Description:</strong> ${animal.description || ""}</p>
    </div>
  `;
}


function showModal() {
  if (!selectedAnimalId) {
    alert("Please click an animal on the left first.");
    return;
  }
  document.getElementById("delete-modal").style.display = "flex";
}
window.showModal = showModal;

function hideModal() {
  document.getElementById("delete-modal").style.display = "none";
}
window.hideModal = hideModal;