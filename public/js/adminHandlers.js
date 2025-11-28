//add page

async function addAnimal(newAnimalData) {
    try {
        const response = await fetch('/animals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newAnimalData) 
        });


        const result = await response.json(); 

        if (response.ok) {
            console.log("Animal inserted successfully");
            alert("Animal Inserted Successfully");
            //  clear  form 
            const formElement = document.getElementById('animalForm');
            if (formElement) {
                formElement.reset(); 
            }

            return true;
        } else {
            console.error("Server insertion error:", result.message || "Unknown error");
            alert('Error inserting animal.');
            return false;
        }

    } catch (error) {
        console.error(error);
        alert("Error: Could not reach the server.");
        return false;
    }
}
 

//remove page

//get the animals & then call showAnimalList
async function loadAnimalList() {
    const res = await fetch('/view/animals', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch animals: ${res.status} ${res.statusText}`);
    }

    const animalData = await res.json(); 
    showAnimalList(animalData); 
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


//search
function setUpSearch() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", () => {
    const q = searchInput.value.toLowerCase();
    const filtered = allAnimals.filter((animal) => {
      const idStr = String(animal.id);
      const nameStr = (animal.name || "").toLowerCase();
      return idStr.includes(q) || nameStr.includes(q);
    });
    showAnimalList(filtered);
  });
}

async function adoptAnimal(id) {
    const url = "/"+ id + "/adopt"
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
            loadAnimalsList();

            return true;
        } else {
            console.error("Server update error:", result.message || "Unknown error");
            alert('Error modifying animal.');
            return false;
        }

    } catch (error) {
        console.error(error);
        alert("Error: Could not reach the server.");
        return false;
    }
}


//perm delete / bring back page
async function permanantelyDelete(id) {
    const url = "/"+ id;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json' 
            },
        });


        if (response.status === 204) {
            console.log("Animal deleted successfully");
            alert("Animal deleted");
            loadAnimalList();

            return true;
        } else {
            const result = await response.json(); 
            console.error("Server deletion error:", result.message || "Unknown error");
            alert('Error deleting animal.');
            return false;
        }

    } catch (error) {
        console.error(error);
        alert("Error: Could not reach the server.");
        return false;
    }
}

// //bring back (show on main page) animal
async function bringbackAnimal(id) {
    const url = "/"+ id + "/bringback"
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        if (response.ok) {
            console.log("Animal modified successfully");
            alert("Animal is adoptable");
            //reload animals
            loadAnimalsList();

            return true;
        } else {
            console.error("Server update error:", result.message || "Unknown error");
            alert('Error modifying animal.');
            return false;
        }

    } catch (error) {
        console.error(error);
        alert("Error: Could not reach the server.");
        return false;
    }
}




//edit  updating




// //edit / update an animal
// router.put('/:id', requireAdmin,async (req, res) => {
//     try {
//         const id = req.params.id;
//         const newData = req.body;

//         const data = await editAnimal(id, newData); 
//         res.status(200).json({ success: true, message: 'Animal updated successfully.', data: data });
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Failed to edit animal.', error: error.message });
//     }
// });

