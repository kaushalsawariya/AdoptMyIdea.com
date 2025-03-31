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

// Job application routes
app.get('/job-application', (req, res) => {
    res.render('job-application', {
        title: 'Job Application | SMG Electric'
    });
});

// Internship application routes
app.get('/internship-application', (req, res) => {
    res.render('internship-application', {
        title: 'Internship Application | SMG Electric'
    });
});

// Application success route
app.get('/application-success', (req, res) => {
    res.render('application-success', {
        title: 'Application Submitted | SMG Electric'
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

// Add test ride booking form route
app.get('/book-test-ride', (req, res) => {
    const centerId = req.query.center;
    res.render('book-test-ride-form', {
        title: 'Book Test Ride | SMG Electric',
        centerId: centerId
    });
});

app.get('/dealers', (req, res) => {
    res.render('dealers', {
        title: 'Find a Dealer | SMG Electric'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});