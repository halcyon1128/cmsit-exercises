const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to handle adding a new word
app.post('/api/words', (req, res) => {
    const newWord = req.body.word;

    fs.readFile(path.join(__dirname, 'data/words.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error reading data file');
        }

        const words = JSON.parse(data);
        words.push(newWord);

        fs.writeFile(path.join(__dirname, 'data/words.json'), JSON.stringify(words, null, 2), err => {
            if (err) {
                console.error('Error writing data file:', err);
                return res.status(500).send('Error writing data file');
            }

            res.status(201).send('Word added successfully');
        });
    });
});

// Endpoint to get all words
app.get('/api/words', (req, res) => {
    fs.readFile(path.join(__dirname, 'data/words.json'), 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading data file:', err);
            return res.status(500).send('Error reading data file');
        }

        const words = JSON.parse(data);
        res.json(words);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});