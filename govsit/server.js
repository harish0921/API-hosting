const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve the course HTML file
app.get('/course/:courseName', (req, res) => {
    const courseName = req.params.courseName;
    const filePath = path.join(__dirname, 'public', `${courseName}.html`);
    res.sendFile(filePath, err => {
        if (err) {
            res.status(err.status).end();
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});