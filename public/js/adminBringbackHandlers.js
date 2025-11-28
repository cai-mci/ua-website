import { showAnimalList  } from "./adminRemoveHandlers.js";
import { loadAnimalsFromAPI } from './adminHandlers.js';
// import { loadAnimal } from "./animalDetail.js";


export async function loadAndShow() {
    let animals;
    try {
        const rawAnimalData = await loadAnimalsFromAPI();
        animals = await rawAnimalData.filter(a => a.adoptable === false);
        
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



//perm delete / bring back page
export async function permanantelyDelete(id) {
    const url = "/animals/"+ id;
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
            loadAndShow();

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
export async function bringbackAnimal(id) {
    const url = "/animals/"+ id + "/bringback"
    try {
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json' 
            }
        });

        if (response.ok) {
            console.log(response)
            console.log("Animal modified successfully");
            alert("Animal is adoptable");
            //reload animals
            loadAndShow();

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
