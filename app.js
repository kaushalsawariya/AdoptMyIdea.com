const express = require('express');
const app = express();
const path = require('path');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));

// Routes
const calculatorRoutes = {
    'ice-vs-ev': 'ICE vs EV Calculator',
    'tax-saver': 'Tax Saver Calculator',
    'emi': 'EMI Calculator'
};

// Landing page
app.get('/', (req, res) => {    
    res.render("landing");
});

// Calculator routes
Object.keys(calculatorRoutes).forEach(route => {
    app.get(`/calculators/${route}`, (req, res) => {
        res.render(route, { title: calculatorRoutes[route] });
    });
});

// Static pages
app.get('/gallery', (req, res) => {
    res.render('gallery', { title: 'Gallery' });
});

app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About Us'
    });
});

// Career routes
app.get('/career', (req, res) => {
    res.render('career', { 
        title: 'Careers at SMG Electric'
    });
});

// Legal routes
app.get('/privacy', (req, res) => {
    res.render('privacy');
});

app.get('/terms', (req, res) => {
    res.render('terms');
});

// Auth Routes
app.get('/login', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

// Add this route with your other routes
app.get('/test-ride', (req, res) => {
    res.render('test-ride', {
        title: 'Book Test Ride | SMG Electric'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});