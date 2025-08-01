const { poolPromise, sql } = require('../db');

// POST: Handle feedback submission
exports.submitFeedback = async (req, res) => {
    const { subject, message, email } = req.body;

    try {
        const pool = await poolPromise;

        await pool.request()
            .input('subject', sql.VarChar, subject)
            .input('message', sql.Text, message)
            .input('email', sql.VarChar, email)
            .query(`
                INSERT INTO feedback (subject, message, email)
                VALUES (@subject, @message, @email)
            `);

        res.status(200).json({
            success: true,
            message: 'Feedback submitted successfully!'
        });
    } catch (err) {
        console.error('Error submitting feedback:', err);
        res.status(500).json({
            success: false,
            message: 'There was an error. Please try again later.'
        });
    }
};
