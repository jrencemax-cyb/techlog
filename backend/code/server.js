
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


// Update problem report
app.put('/api/reports/:id', (req, res) => {
    const { computer_number, problem_type, severity, description, status } = req.body;

    const sql = `
        UPDATE problem_reports
        SET computer_number = ?, problem_type = ?, severity = ?, description = ?, status = ?
        WHERE id = ?
    `;

    db.query(sql, [computer_number, problem_type, severity, description, status, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update report.' });
        }

        res.json({ message: 'Report updated successfully!' });
    });
});


// Delete problem report
app.delete('/api/reports/:id', (req, res) => {
    const sql = 'DELETE FROM problem_reports WHERE id = ?';

    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete report.' });
        }

        res.json({ message: 'Report deleted successfully!' });
    });
});


// Update computer unit
app.put('/api/computers/:id', (req, res) => {
    const { computer_number, laboratory, status } = req.body;

    const sql = `
        UPDATE computer_units
        SET computer_number = ?, laboratory = ?, status = ?
        WHERE id = ?
    `;

    db.query(sql, [computer_number, laboratory, status, req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to update computer.' });
        }

        res.json({ message: 'Computer updated successfully!' });
    });
});


// Delete computer unit
app.delete('/api/computers/:id', (req, res) => {
    const sql = 'DELETE FROM computer_units WHERE id = ?';

    db.query(sql, [req.params.id], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to delete computer.' });
        }

        res.json({ message: 'Computer deleted successfully!' });
    });
});



app.listen(5000, () => {
    console.log('TechLog server running on http://localhost:5000');
});
