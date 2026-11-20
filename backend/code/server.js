
const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());


app.post('/api/reports', (req, res) => {
    const { computer_number, problem_type, severity, description } = req.body;

    const sql = `
        INSERT INTO problem_reports
        (computer_number, problem_type, severity, description)
        VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [computer_number, problem_type, severity, description], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to submit report.' });
        }

        res.status(201).json({ message: 'Report submitted successfully!' });
    });
});


app.get('/api/reports', (req, res) => {
    const sql = 'SELECT * FROM problem_reports';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve reports.' });
        }

        res.json(results);
    });
});


app.get('/api/computers', (req, res) => {
    const sql = 'SELECT * FROM computer_units';

    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to retrieve computers.' });
        }

        res.json(results);
    });
});


app.get('/api/reports/search', (req, res) => {
    const search = `%${req.query.search || ''}%`;

    const sql = `
        SELECT * FROM problem_reports
        WHERE computer_number LIKE ?
        OR problem_type LIKE ?
        OR severity LIKE ?
        OR description LIKE ?
        OR status LIKE ?
    `;

    db.query(sql, [search, search, search, search, search], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to search reports.' });
        }

        res.json(results);
    });
});


app.get('/api/computers/search', (req, res) => {
    const search = `%${req.query.search || ''}%`;

    const sql = `
        SELECT * FROM computer_units
        WHERE computer_number LIKE ?
        OR laboratory LIKE ?
        OR status LIKE ?
    `;

    db.query(sql, [search, search, search], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to search computers.' });
        }

        res.json(results);
    });
});



app.listen(5000, () => {
    console.log('TechLog server running on http://localhost:5000');
});
