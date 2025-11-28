async function addAnimal(newAnimalData) {
    console.log(newAnimalData);
    try {
        const response = await fetch('/animals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newAnimalData) 
        });


        console.log(response);
        if (response.ok) {
            console.log(response.data);
            console.log("Animal inserted successfully");
            alert("Animal Inserted Successfully");
            //  clear  form 
            const formElement = document.getElementById('animalForm');
            if (formElement) {
                formElement.reset(); 
            }

            return true;
        } else {
            console.error("Server insertion error:", "Unknown error");
            alert('Error inserting animal.');
            return false;
        }

    } catch (error) {
        console.error(error);
        alert("Error: Could not reach the server.");
        return false;
    }
}