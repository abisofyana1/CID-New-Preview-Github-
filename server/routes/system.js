const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Execute SQL File
router.post('/execute-sql', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No SQL file uploaded' });
    }

    const filePath = req.file.path;

    try {
        const sqlContent = fs.readFileSync(filePath, 'utf8');

        // Execute the SQL content
        // Note: executing multiple statements at once might require special handling depending on the driver.
        // pg driver supports multiple statements in one query string.
        await db.query(sqlContent);

        // Clean up file
        fs.unlinkSync(filePath);

        res.json({ message: 'SQL file executed successfully.' });
    } catch (err) {
        console.error('SQL Execution Error:', err);
        // Clean up file even on error
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        res.status(500).json({ error: 'Failed to execute SQL file: ' + err.message });
    }
});

module.exports = router;
