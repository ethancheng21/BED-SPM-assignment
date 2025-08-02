const Feedback = require("../models/feedbackModel");

exports.submitFeedback = async (req, res) => {
  try {
    // Ensure required fields are present
    const { subject, message, email } = req.body;
    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required." });
    }

    // Save feedback to database
    await Feedback.insertFeedback({ subject, message, email });

    res.status(201).json({ success: true, message: "Feedback submitted successfully!" });
  } catch (err) {
    console.error("❌ Error submitting feedback:", err.message);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
};
