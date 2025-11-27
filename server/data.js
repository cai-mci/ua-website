const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


//admin add new animal to db
async function insertAnimal(animalData) {
    const { data, error } = await supabase
        .from('animals')
        .insert([animalData])
        .select(); 

    if (error) {
        console.error("Supabase Insert Error:", error);
        throw error;
    }
    return data;
}


//permanently remove animal from db
async function deleteAnimal(id) {
    const { _, error } = await supabase
        .from('animals')
        .delete()
        .eq('id', id); 

    if (error) {
        console.error("Supabase Delete Error:", error);
        throw error;
    }
    return 0;
}


//hide animal from display, keep in db & for admin access
async function adoptAnimal(id) {
    const { data, error } = await supabase
        .from('animals')
        .update('adoptable', false)
        .eq('id', id)
        .select();

    if (error) {
        console.error("Supabase Update Error:", error);
        throw error;
    }
    return data
}

//show animal on display that was previously removed
async function bringbackAnimal(id) {
    const { data, error } = await supabase
        .from('animals')
        .update('adoptable', true)
        .eq('id', id)
        .select(); 

    if (error) {
        console.error("Supabase Update Error:", error);
        throw error;
    }
    return data
}

//update animal
async function editAnimal(newData) {
    const { data, error } = await supabase
        .from('animals')
        .update([newData])
        .eq('id', id)
        .select(); 

    if (error) {
        console.error("Supabase Update Error:", error);
        throw error;
    }
    return data;
}


async function getAnimal(id) {
    const { data, error } = await supabase
        .from('animals')
        .eq('id', id)
        .select(); 

    if (error) {
        console.error("Supabase Select Error:", error);
        throw error;
    }
    return data;
}


//get all animals, take filters into account
async function getAnimals(filters = {}) {
    let query = supabase.from('animals').select();

    if (Object.keys(filters).length > 0) {
        query = query.match(filters); 
    }

    const { data, error } = await query;

    if (error) {
        console.error("Supabase Select Error:", error);
        throw error;
    }

    return data;
}



//get username & password for logging in
async function getUser(username) {
    const { data, error } = await supabase
        .from('admin')
        .eq('username', username)
        .select(); 

    if (error) {
        console.error("Supabase Select Error:", error);
        throw error;
    }
    return data;
}



module.exports = {
    insertAnimal,
    deleteAnimal,

    adoptAnimal,
    bringbackAnimal,

    editAnimal,

    getAnimal,
    getAnimals,

    getUser
};