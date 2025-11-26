// server.js
const express = require('express');
const app = express();

const path = require('path'); //lets us use dirname
app.use(express.static(path.join(__dirname, 'public'))); //allows access to everything in public

// const animals = require('./public/animals');
app.use(express.static('public'));
const bcrypt = require('bcrypt');

app.use(express.json()) //allows to use json


// Start the server
const port = 3000;
app.listen(port, () => {
  console.log('Server running on http://localhost:3000');
});

app.post('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.post('/admin/login', async (req, res) =>{
    const username = req.body.username;
    const password = req.body.password;

    console.log("Username:", username);
    console.log("Password:", password);


    const { data, error } = await supabase
        .from("admin")
        .select('*')
        .eq('username', username)
        .single(); //find user in db
    

    if (error) { return res.status(500).send('Database error'); } 

    //can't find user
    if (!data) { return res.sendStatus(404); }

    //can find user
    try {
        //will hash inital password (with salt gotten from req.body password)
        //returns true if same
        // if (await bcrypt.compare(password, data.password)) {
        if (password == data.password) {
            console.log('console - Success')
            res.status(200).send('Success'); 
        } else {
            res.status(401).send('Wrong Password')
        }
        
        
    } catch {
        console.log('Failed comparing')
        res.status(501).send('Failed comparing passwords')
    }
});


app.get('/adopt', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adopt.html'));
});

//individual animal (want this to be the id??)
app.get('/adopt/detail', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'animaldetail.html'));
});

app.get('/foster', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'foster.html'));
});


app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.get('/admin/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'addanimal.html'));
});

app.get('/admin/remove', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'removeanimal.html'));
});

app.get('/admin/edit', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'editanimal.html'));
});




async function loadAnimals() {
  const tiles = document.getElementById("tiles");
  if (!tiles) return;
  tiles.innerHTML = "<p>Loading…</p>";

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from("animals").select("*").order("id", { ascending: true });

  if (error) {
    console.error("Fetch error:", error);
    tiles.innerHTML = `<p class="error">Could not load animals. ${error.message}</p>`;
    return;
  }

  const ui = getFilters();
  const filtered = (data || []).filter((rec) => passesFilters(rec, ui));

  tiles.innerHTML = "";
  if (filtered.length === 0) {
    tiles.innerHTML = "<p>No animals match your filters right now.</p>";
    return;
  }

  filtered.forEach((animal) => {
    const a = document.createElement("a");
    a.className = "animal";
    a.href = buildDetailHref(animal.id);

    const img = document.createElement("img");
    img.src = animal.image_url || animal.image || "img/default.jpg";
    img.alt = "";
    img.onerror = onImgError;

    const h3 = document.createElement("h3");
    h3.textContent = animal.name || "Adoptable Animal";

    const p = document.createElement("p");
    const bits = [];

    const ageTxt = ageLabelFromRecord(animal);
    if (ageTxt) bits.push(ageTxt);

    const sp = speciesLabelFromRecord(animal);
    if (sp) bits.push(sp);

    const gTxt = genderLabel(animal.gender);
    if (gTxt) bits.push(gTxt);

    const actTxt = activityLabelFromRecord(animal);
    if (actTxt) bits.push(`${actTxt} activity`);

    if (bits.length) p.textContent = bits.join(" · ");

    a.appendChild(img);
    a.appendChild(h3);
    if (bits.length) a.appendChild(p);

    tiles.appendChild(a);
  });
}


//inserting an animal
app.post('/admin/addanimal', async (req, res) => {
  try {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    console.log(req.body)

    const { data, error } = await supabase
      .from('animals')
      .insert([req.body]);

    if (error) return res.status(500).json({ error });

    res.status(200).json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ err });
  }
});

async function loadAnimal(id) {
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { data, error } = await supabase.from("animals").select("*").eq("id", id).single();
  if (error) {
    console.error("Error fetching animal details:", error);
    return null;
  }
  return data;
}

function labeledRow(label, value) {
  if (!nonEmpty(value)) return "";
  return `<p><strong>${label}:</strong> ${value}</p>`;
}

async function displayAnimalDetails(id) {
  const container = document.getElementById("animal-detail-container");
  if (!container) return;
  try {
    container.innerHTML = "";
    const animal = await loadAnimal(id);
    if (!animal) {
      container.innerHTML = "<h1>Animal Not Found</h1><p>Could not retrieve data for this animal.</p>";
      return;
    }
    const name = animal.name || "Adoptable Animal";
    const imgSrc = getImageSrc(animal);
    container.innerHTML = `
      <div class="animal-detail">
        <img src="${imgSrc}" alt="${name}" style="max-width: 400px; width: 100%; height: auto;">
        <h1>${name}</h1>
        ${labeledRow("Species", speciesLabelFromRecord(animal))}
        ${labeledRow("Age", animal.age)}
        ${labeledRow("Gender", genderLabel(animal.gender))}
        ${labeledRow("Activity Level", activityLabelFromRecord(animal))}
        ${labeledRow("Description", animal.description)}
      </div>
    `;
  } catch (err) {
    console.error("Detail render error:", err);
    container.innerHTML = `<p class="error">Could not render details.</p>`;
  }
}




const animalsRouter = require('./server/animalData.js');
app.use('/api/animals', animalsRouter);