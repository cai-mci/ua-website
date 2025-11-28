import { loadAnimalsFromAPI } from './adminHandlers.js';

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
            listBox.innerHTML = `<p class="error p-2">Failed to load data</p>`;
        }
    }
    return animals;


}

function showAnimalList(dataToShow) {
  const listBox = document.getElementById("animal-list");
  listBox.innerHTML = "";

  dataToShow.forEach((animal) => {
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