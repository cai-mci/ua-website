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
