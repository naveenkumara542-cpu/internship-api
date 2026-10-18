const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.get('/api/internships', (req, res) => {
    let { page = 1, limit = 10, domain } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    let items = db.getAll();

    if (domain) {
        items = items.filter(item => item.domain.toLowerCase() === domain.toLowerCase());
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedItems = items.slice(startIndex, endIndex);

    res.json({
        total: items.length,
        page,
        limit,
        data: paginatedItems
    });
});

app.get('/api/internships/:id', (req, res) => {
    const items = db.getAll();
    const item = items.find(i => i.id == req.params.id);

    if (!item) {
        return res.status(404).json({ error: "Internship record not found" });
    }
    res.json(item);
});

app.post('/api/internships', (req, res) => {
    const { title, company, location, stipend, domain, description } = req.body;

    if (!title || !company || !location || !domain) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const items = db.getAll();
    const newItem = {
        id: items.length > 0 ? items[items.length - 1].id + 1 : 1,
        title,
        company,
        location,
        stipend: stipend || 'Unpaid',
        domain,
        description: description || '',
        created_at: new Date().toISOString()
    };

    items.push(newItem);
    db.saveAll(items);

    res.status(201).json({
        message: "Internship created successfully",
        data: newItem
    });
});

app.delete('/api/internships/:id', (req, res) => {
    let items = db.getAll();
    const initialLength = items.length;
    
    items = items.filter(i => i.id != req.params.id);

    if (items.length === initialLength) {
        return res.status(404).json({ error: "Internship record not found" });
    }

    db.saveAll(items);
    res.json({ message: "Internship deleted successfully" });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
