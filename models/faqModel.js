const sql = require('mssql');
const dotenv = require('dotenv');
dotenv.config();  // Load environment variables

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    options: {
        encrypt: true,  // For Azure SQL Database
        trustServerCertificate: true, // Disable for production
    },
};

// Function to get all FAQs from the database
async function getAllFaqs() {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM faqs');
        return result.recordset;  // Return the fetched FAQs
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        throw error;  // Rethrow error
    }
}

// Function to add a new FAQ to the database
async function addFaq(question, answer, category) {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('question', sql.VarChar, question)
            .input('answer', sql.Text, answer)
            .input('category', sql.VarChar, category)
            .query('INSERT INTO faqs (question, answer, category) VALUES (@question, @answer, @category)');
    } catch (error) {
        console.error('Error adding FAQ:', error);
        throw error;  // Rethrow error
    }
}

// Function to update an existing FAQ in the database
async function updateFaq(id, question, answer, category) {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('faq_id', sql.Int, id)
            .input('question', sql.VarChar, question)
            .input('answer', sql.Text, answer)
            .input('category', sql.VarChar, category)
            .query('UPDATE faqs SET question = @question, answer = @answer, category = @category WHERE faq_id = @faq_id');
    } catch (error) {
        console.error('Error updating FAQ:', error);
        throw error;  // Rethrow error
    }
}

// Function to delete an FAQ from the database
async function deleteFaq(id) {
    try {
        const pool = await sql.connect(config);
        await pool.request()
            .input('faq_id', sql.Int, id)
            .query('DELETE FROM faqs WHERE faq_id = @faq_id');
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        throw error;  // Rethrow error
    }
}

module.exports = { getAllFaqs, addFaq, updateFaq, deleteFaq };  // Export functions to use in controller
