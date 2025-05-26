const express = require('express');            // Handles routing for the API
const multer = require('multer');              // Temporarily stores uploaded files
const fs = require('fs');                      // Reads and deletes local files
const axios = require('axios');                // Sends HTTP requests to FastAPI
const FormData = require('form-data');         // Builds multipart/form-data payloads
const path = require('path');                  // (Optional) Helps with file path handling

const router = express.Router();

// Temporarily store uploaded PDFs in 'uploads/' folder
const upload = multer({ dest: 'uploads/' });

router.post('/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: 'No file was uploaded.' });
        }

        const formData = new FormData();
        formData.append('file', fs.createReadStream(file.path), file.originalname);

        const response = await axios.post(process.env.FASTAPI_URL, formData, {
            headers: formData.getHeaders(),
        });

        fs.unlinkSync(file.path); // Clean up uploaded file after processing
        console.log('Data received from FastAPI:', response.data);

        return res.status(200).json({
            message: 'Analyses processed successfully.',
            data: response.data
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'An error occurred while processing the file.',
            error: err.message
        });
    }
});

module.exports = router;
