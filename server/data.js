const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


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
