// --- Constants from supabase project ---
const SUPABASE_URL = "https://pijsxjlqxeqanknogalx.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpanN4amxxeGVxYW5rbm9nYWx4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE1MTQ3MjUsImV4cCI6MjA3NzA5MDcyNX0.-UTF0fw7eBQZFlFK5H9FPy6FCiAwDBjj3oAM-lXfyEg";

//get animals from database
async function loadAnimals() {
    //initialize supabase
    const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    
    //query the database to get all the data from the animals table
    const { data, error } = await supabase.from('animals').select('*');

    if (error) {
        console.log("Data:", data);
        console.log("Error:", error);
        return;
    } else {
        console.log("Data:",data);
    } //prints out in console just for debugging purposes

    //access the div id = "animals-container from animals.html"
    const animals = document.getElementById('animals-container');
    //clear the container
    animals.innerHTML = ""; 


    //add each item to the container animals
    data.forEach(animal => {
        //create a <p> element within the container
        const p = document.createElement('p');
        
        //make the text of the element be "Name:", the name field of the animal, "Age:" the age field of the animal
        p.textContent = `Name: ${animal.name}, Age: ${animal.age}`;
        
        //add this to the <p> element
        animals.appendChild(p);
    });
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
