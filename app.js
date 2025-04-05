require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const bcrypt = require('bcryptjs'); // Make sure it's bcryptjs not bcrypt
const jwt = require('jsonwebtoken');
const userModel = require('./models/user');
const rateLimit = require('express-rate-limit');
const { check, validationResult } = require('express-validator');
const cookieParser = require('cookie-parser'); // Add this with your other requires at the 
const mongoose = require('mongoose');
const cors= require('cors');
const bodyParser = require('body-parser');

mongoose.connect(process.env.MONGO_URI)

.then(() => {
    console.log('✅ Connected to MongoDB');
})
.catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
});


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static('public'));
app.use(express.static('public'));
app.use(cookieParser()); // Add this with your other middleware
app.use(cors());
app.use(bodyParser.json());

const limiter = rateLimit({ // Add this after other middleware
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/signup', limiter);




// to locate ev charging stations

app.get("/stations", async (req, res) => {
    try {
        const stations = await Station.find();
        res.json(stations);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
app.get('/find-charging-station', (req, res) => {
    res.render('index', {
        title: 'Find Charging Station | SMG Electric'
    });
});

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 failed attempts per window
    message: 'Too many login attempts from this IP, please try again after 15 minutes'
});

app.use('/login', loginLimiter);

// Add validation middleware
const validateSignup = [
    check('name').trim().isLength({ min: 2 })
        .withMessage('Name must be at least 2 characters long'),
    check('email').isEmail().normalizeEmail()
        .withMessage('Must be a valid email address'),
    check('password').isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    check('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    })
];

const validateLogin = [
    check('email').isEmail().normalizeEmail(),
    check('password').not().isEmpty()
];

// Add this after your middleware setup
app.use(async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET );
            const user = await userModel.findOne({ email: decoded.email }).exec();
            res.locals.user = user;
        } else {
            res.locals.user = null;
        }
        next();
    } catch (error) {
        res.locals.user = null;
        next();
    }
});

// Add this after your existing middleware
const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.redirect('/login');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET );
        const user = await userModel.findOne({ email: decoded.email }).exec();
        
        if (!user) {
            res.clearCookie('jwt');
            return res.redirect('/login');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.clearCookie('jwt');
        res.redirect('/login');
    }
};

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
app.get('/job-application', requireAuth, (req, res) => {
    res.render('job-application', {
        title: 'Job Application | SMG Electric'
    });
});

// Internship application routes
app.get('/internship-application', requireAuth,(req, res) => {
    res.render('internship-application', {
        title: 'Internship Application | SMG Electric'
    });
});

// Application success route
app.get('/application-success',requireAuth, (req, res) => {
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
app.post('/login', validateLogin, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            req.flash('error', 'Invalid email or password format');
            return res.status(400).render('login', {
                error: 'Please check your credentials',
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).render('login', {
                error: 'Please provide both email and password'
            });
        }

        const user = await userModel.findOne({ email }).exec();
        if (!user) {
            return res.status(401).render('login', {
                error: 'Invalid email or password'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).render('login', {
                error: 'Invalid email or password'
            });
        }

        const token = jwt.sign({ email }, process.env.JWT_SECRET , {
            expiresIn: '24h'
        });
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.redirect('/');
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).render('login', {
            error: 'An error occurred during login'
        });
    }
});

app.get('/signup', (req, res) => {
    res.render('signup');
});
app.post('/signup', validateSignup, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).render('signup', {
                error: 'Please fix the following errors:',
                errors: errors.array(),
                values: req.body
            });
        }

        const { name, email, password } = req.body;

        // Check for strong password
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        if (!passwordRegex.test(password)) {
            return res.status(400).render('signup', {
                error: 'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                values: req.body
            });
        }

        if (!name || !email || !password) {
            return res.status(400).render('signup', {
                error: 'Please provide all required fields',
                values: req.body
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email }).exec();
        if (existingUser) {
            return res.status(400).render('signup', {
                error: 'This email is already registered',
                values: req.body
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = new userModel({
            name,
            email,
            password: hash
        });

        await newUser.save();

        const token = jwt.sign({ email }, process.env.JWT_SECRET , {
            expiresIn: '24h'
        });
        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production'
        });

        res.redirect('/login');
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).render('signup', {
            error: 'An error occurred during signup',
            values: req.body
        });
    }
});

// Add this with your other auth routes
app.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});


app.get("/", (req, res) => {
    res.render("index");
});

// Add this route with your other routes
app.get('/test-ride',requireAuth, (req, res) => {
    res.render('test-ride', {
        title: 'Book Test Ride | SMG Electric'
    });
});

// Add test ride booking form route
app.get('/book-test-ride',requireAuth, (req, res) => {
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


// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render('error', {
        title: 'Error',
        message: 'Something went wrong!'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});