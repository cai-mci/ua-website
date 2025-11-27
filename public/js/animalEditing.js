async function handleNewAnimalSubmission(event) {
    event.preventDefault(); 
    
    const form = document.getElementById("animalForm");
    if (!form) return; 

    const fields = [
        "animal", "name", "agegroup", "gender", "infoster",
        "intakedate", "activitylevel", "size", "description",
        "goodwith", "personality", "fixed", "image_url"
        // Add all fields relevant to your form
    ];
    
    const newAnimal = {};

    fields.forEach((field) => {
        const el = document.getElementById(field);
        if (!el) return;
        const value = el.value;
        // Handle empty fields/null values for database insertion
        if (value === "" || value === "Select...") {
            newAnimal[field] = null;
        } else {
            newAnimal[field] = value;
        }
    });

    console.log("Inserting new animal with data:", newAnimal);

    try {
        // API CALL: POST /animals (Uses the route you provided)
        const response = await fetch('/animals', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newAnimal)
        });

        const result = await response.json();

        if (!response.ok) {
            // Handle 4xx or 5xx status codes
            throw new Error(result.message || 'Failed to insert new animal.');
        }

        alert(`Animal "${newAnimal.name || 'New Animal'}" successfully added!`);
        
        // Clear the form after success
        form.reset(); 
        
        // Optional: Redirect the user or reload the list if this was the edit page
        // window.location.href = 'admin.html';

    } catch (error) {
        console.error("API insert error:", error);
        alert("Error adding animal: " + error.message);
    }
}