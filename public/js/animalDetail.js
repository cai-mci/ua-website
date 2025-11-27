import { getImageSrc, labeledRow } from "./utils.js";

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
    container.innerHTML = "Loading animal details...";

    const animal = await loadAnimal(id);
    if (!animal) {
      container.innerHTML =
        "<h1>Animal Not Found</h1><p>Could not retrieve data for this animal.</p>";
      return;
    }
    const name = animal.name || "Adoptable Animal";
    const gender = animal.gender || "";
    const fixed = animal.fixed || animal.fixed_status || "";
    const ageDisplay = animal.age || animal.agegroup || "";
    const intakeDate = animal.intakedate || "";
    const activity = animal.activitylevel || animal.activity_level || "";
    const size = animal.size || "";
    const breed = animal.breed || "";
    const weight = animal.weight || "";
    const goodwith = animal.goodwith || "";
    const description = animal.description || "";

    const imgSrc = getImageSrc(animal);
    container.innerHTML = `
      <div class="detail-info">
        <h1>${name}</h1>

        <p class="detail-subtitle">
          ${gender || "Unknown"}
          ${fixed ? ", " + fixed : ""}
          ${ageDisplay ? "&nbsp;&nbsp;&nbsp;" + ageDisplay : ""}
        </p>

        <p class="detail-intake">
          Intake date: ${intakeDate || "TBD"}
        </p>

        <p><span class="detail-section-label">Activity Level:</span> ${
          activity || "—"
        }</p>
        <p><span class="detail-section-label">Size:</span> ${size || "—"}</p>
        <p><span class="detail-section-label">Breed:</span> ${breed || "—"}</p>
        <p><span class="detail-section-label">Weight:</span> ${
          weight || "—"
        }</p>
        <p><span class="detail-section-label">Good with:</span> ${
          goodwith || "—"
        }</p>

        <div class="detail-description-block">
          <p class="detail-section-label">Description:</p>
          <p>${description || "No description yet."}</p>
        </div>

        <div class="detail-interest">
          <p class="detail-interest-title">Interested in adopting?</p>
          <div class="detail-cta-row">
            <a href="/adoption-form" class="detail-cta-primary">Adoption Application</a>
            <a href="/#contact" class="detail-cta-secondary">Contact Us</a>
          </div>
        </div>
      </div>

      <div class="detail-photo">
        <img src="${imgSrc}" alt="${name}">
      </div>
    `;
  } catch (err) {
    console.error("Detail render error:", err);
    container.innerHTML = `<p class="error">Could not render details.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("animal-detail-container");
  if (!container) return;
  const params = new URLSearchParams(window.location.search);
  const id = Number(params.get("id"));

  if (Number.isFinite(id) && id > 0) {
    displayAnimalDetails(id);
  } else {
    container.innerHTML =
      "<h1>Animal Not Found</h1><p>No animal ID was provided in the URL.</p>";
  }
});
