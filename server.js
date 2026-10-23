const express = require('express');
const cors = require('cors');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // لخدمة ملفات الواجهة (HTML, CSS)

// ممر ميدل وير (Middleware) لجلب الوصفات من TheMealDB
app.get('/api/recipe/:name', async (req, res) => {
    try {
        const mealName = req.params.name;
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(mealName)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch recipe from middleware" });
    }
});

// ممر ميدل وير (Middleware) لجلب القيم الغذائية من FoodData Central
app.get('/api/nutrition/:food', async (req, res) => {
    try {
        const foodName = req.params.food;
        const apiKey = "DEMO_KEY";
        const response = await fetch(`https://api.nal.usda.gov/fdc/v1/foods/search?api_key=${apiKey}&query=${encodeURIComponent(foodName)}`);
        const data = await response.json();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch nutrition from middleware" });
    }
});

app.listen(PORT, () => {
    console.log(`Middleware Server is running on http://localhost:${PORT}`);
});