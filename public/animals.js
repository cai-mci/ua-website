// --- Constants from supabase project ---
const SUPABASE_URL = "https://pijsxjlqxeqanknogalx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpanN4amxxeGVxYW5rbm9nYWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ3MjUsImV4cCI6MjA3NzA5MDcyNX0.-UTF0fw7eBQZFlFK5H9FPy6FCiAwDBjj3oAM-lXfyEg";

// --- Main function to load and display all animal tiles (for adopt.html) ---
async function loadAnimals() {
    // Initialize supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Query the database to get all the data from the animals table
    const { data, error } = await supabase.from('animals').select('*');

    if (error) {
        console.error("Error fetching data:", error);
        return;
    }

    // FIX 1: Access the single container used in adopt.html
    const tilesContainer = document.getElementById('tiles');
    
    if (!tilesContainer) {
        console.error("Error: The container element with id='tiles' was not found.");
        return; 
    }
    
    // Clear the container
    tilesContainer.innerHTML = ""; 

    data.forEach(animalData => {
        // 1. Create the main <div> element and set its class
        const div = document.createElement('div');
        div.className = 'animal';
        
        // 2. Add click listener for navigation
        div.addEventListener('click', () => {
            const animalId = animalData.id;
            const detailPageURL = `animaldetail.html?id=${animalId}`;
            window.location.href = detailPageURL;
        });
    
        // 3. Set image path (Using static as fallback)
        let imageSrc = 'rio/dog1.jpg'; // You can change this to animalData.image_url later
    
        // 4. Create <img> element
        const img = document.createElement('img');
        img.src = imageSrc;
    
        // 5. Create <h3> element for Name
        const h3 = document.createElement('h3');
        h3.textContent = animalData.name; 
    
        // 6. Create <p> element for Age and Gender
        const p = document.createElement('p');
        p.innerHTML = `${animalData.age}<br>${animalData.gender || 'N/A'}`; 


    
        // 7. Append the created elements to the main <div>
        div.appendChild(img);
        div.appendChild(h3);
        div.appendChild(p);
    
        // 8. Append the fully constructed <div> to the tiles container
        tilesContainer.appendChild(div);
    });
    
    // FIX 2: The conflicting second data.forEach loop has been REMOVED!
}

// document.addEventListener('DOMContentLoaded', () => {
//   const addAnimalForm = document.getElementById('animalForm');
//   addAnimalForm.addEventListener('submit', addAnimal);
// });


async function addAnimal(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const age = parseInt(document.getElementById('age').value);

    //initialize supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    //query the database to get all the data from the animals table
    const { data, error } = await supabase.from('animals').insert([{name: name, id: age}]);


    //error handling
        //missiing a NOT NULL field
        //duplicate id
    
    //TODO add auto increment ID
    if (error) {
        console.error('Insert failed:', error);
        alert('Insert failed: ' + error.message);
    } else {
        console.log('Inserted:', data);
        alert('Animal added successfully!');
    }
}
// --- loadAnimal function (for animaldetail.html) ---
async function loadAnimal(id) {
    //initialize supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    // Query the database for a single animal
    const { data, error } = await supabase
        .from('animals')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error("Error fetching animal details:", error);
        return null;
    } 
    return data;
}

// --- displayAnimalDetails function (for animaldetail.html) ---
async function displayAnimalDetails(id) {
    const animal = await loadAnimal(id);
    // NOTE: This assumes 'animal-detail-container' is present in animaldetail.html
    const container = document.getElementById('animal-detail-container');
    
    if (!container) return; // Prevent crash if element is missing
    
    // Clear any loading text
    container.innerHTML = "";

    if (!animal) {
        container.innerHTML = '<h1>Animal Not Found</h1><p>Could not retrieve data for this animal.</p>';
        return;
    }

    // Generate the HTML for the detailed view
    const detailHTML = `
        <div class="animal-detail">
            <img src="${animal.image || 'img/default.jpg'}" alt="${animal.name}" style="max-width: 400px;">
            <h1>${animal.name}</h1>
            <p><strong>ID:</strong> ${animal.id}</p>
            <p><strong>Age:</strong> ${animal.age}</p>
            <p><strong>Gender:</strong> ${animal.gender || 'Not specified'}</p>
            <p><strong>Description:</strong> ${animal.description || 'A lovely pet.'}</p>
        </div>
    `;

    // Inject the generated HTML into the container
    container.innerHTML = detailHTML;
}
