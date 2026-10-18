const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, 'internships.json');

if (!fs.existsSync(dbFile)) {
    const seedData = [
        {
            id: 1,
            title: "Web Development Intern",
            company: "TechCorp",
            location: "Remote",
            stipend: "₹10,000/month",
            domain: "Web Development",
            description: "Frontend development using HTML, CSS, JavaScript",
            created_at: new Date().toISOString()
        },
        {
            id: 2,
            title: "Data Analyst Intern",
            company: "DataWorks",
            location: "Chennai",
            stipend: "₹12,000/month",
            domain: "Data Science",
            description: "Analyzing datasets using Python and SQL",
            created_at: new Date().toISOString()
        }
    ];
    fs.writeFileSync(dbFile, JSON.stringify(seedData, null, 2));
}

const db = {
    getAll: () => {
        const data = fs.readFileSync(dbFile, 'utf8');
        return JSON.parse(data);
    },
    saveAll: (data) => {
        fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
    }
};

module.exports = db;
