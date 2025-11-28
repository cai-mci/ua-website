export async function addAnimal(newAnimalData) {
    console.log("passed in data: ", newAnimalData);
    try {
        const response = await fetch('/animals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newAnimalData) 
        });


        console.log("resposne:", response);
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


export async function uploadImage(file) {
    if (!file) return { success: true, filename: null };

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) throw new Error('Image upload failed');

        const result = await response.text(); // expect { filename: '...' }

        // extract filename from "File uploaded successfully: example.jpg"
        const match = result.match(/File uploaded successfully: (.+)$/);
        const filename = match ? match[1] : null;


        return { success: true, filename: filename, url: null };
    } catch (err) {
        console.error(err);
        return { success: false, filename: null };
    }
}

