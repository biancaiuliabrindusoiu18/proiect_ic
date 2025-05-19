const express = require('express');
const mongoose = require('mongoose');
const Analysis = require('../models/Analysis');  // importă modelul
const axios = require('axios'); // folosit pentru a face cereri HTTP către FastAPI
const multer = require('multer');  // pentru gestionarea fișierelor uploadate

const router = express.Router();

// Configurare multer pentru upload de fișiere
const upload = multer({ dest: 'uploads/' }); // se salvează fișierele încărcate în folderul 'uploads'

// 1. Upload PDF și procesare în FastAPI
router.post('/upload-pdf', upload.single('file'), async (req, res) => {
    try {
        const file = req.file; // fișierul încărcat
        if (!file) {
            return res.status(400).json({ message: 'Fișierul nu a fost încărcat.' });
        }

        // Trimite fișierul către API-ul FastAPI
        const formData = new FormData();
        formData.append('file', file.buffer, file.originalname);

        // Apel FastAPI pentru a analiza fișierul
        const response = await axios.post('http://127.0.0.1:8000/analyze', formData, {
            headers: formData.getHeaders()
        });

        // Dacă analiza a fost realizată cu succes
        if (response.data) {
            const { name, value, unit, interval, date, userId } = response.data;

            // Salvează analiza în MongoDB
            const newAnalysis = new Analysis({
                userId,
                name,
                value,
                unit,
                interval,
                date
            });

            await newAnalysis.save();
            res.status(201).json({ message: 'Analiza a fost salvată cu succes.', analysis: newAnalysis });
        } else {
            res.status(400).json({ message: 'Fișierul nu a putut fi procesat.' });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'A apărut o eroare la procesarea fișierului.', error: err });
    }
});

module.exports = router;
