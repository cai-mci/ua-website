
export async function loadAnimalsFromAPI() {
  const response = await fetch('/view/animals'); 

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const responseData = await response.json();
  const data = responseData.data;
  return data;
}




// //search
// function setUpSearch() {
//   const searchInput = document.getElementById("search-input");
//   searchInput.addEventListener("input", () => {
//     const q = searchInput.value.toLowerCase();
//     const filtered = allAnimals.filter((animal) => {
//       const idStr = String(animal.id);
//       const nameStr = (animal.name || "").toLowerCase();
//       return idStr.includes(q) || nameStr.includes(q);
//     });
//     showAnimalList(filtered);
//   });
// }
