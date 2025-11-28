

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

