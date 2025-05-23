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
const nodemailer = require('nodemailer'); // Add at the top with other requires
const multer = require('multer');
const StartupSale = require('./models/StartupSale');

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });


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



// home page
app.get('/', (req, res) => {    
    res.render("home");
});




app.get('/about', (req, res) => {
    res.render('about', { 
        title: 'About Us'
    });
});

app.get('/startup-listing',requireAuth, (req, res) => {
    res.render('startup-listing-form'); // Renders the EJS form
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

        
        if (!user.isVerified) {
            return res.status(401).render('login', {
                error: 'Please verify your email before logging in'
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

        // Password strength check
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

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes

        const newUser = new userModel({
            name,
            email,
            password: hash,
            isVerified: false,
            otp,
            otpExpiry
        });

        await newUser.save();

        // Send OTP email
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It expires in 10 minutes.`
        });

        res.render('verify-otp', { email, error: null });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).render('signup', {
            error: 'An error occurred during signup',
            values: req.body
        });
    }
});

app.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
        return res.status(400).render('verify-otp', { error: 'User not found', email });
    }
    if (user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).render('verify-otp', { error: 'Invalid or expired OTP', email });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    res.redirect('/login');
});

// Add this with your other auth routes
app.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/login');
});


app.get("/", (req, res) => {
    res.render("index");
});

// Buyers page
app.get('/find-startups',requireAuth, async (req, res) => {
    const query = req.query.q || '';
    let startups = [];
    if (query) {
        startups = await StartupSale.find({
            $or: [
                { startupName: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { location: { $regex: query, $options: 'i' } }
            ]
        });
    } else {
        startups = await StartupSale.find();
    }
    res.render('find-startups', { startups, query });
});


app.get('/help-center', (req, res) => {
    res.render('help-center');
});


app.get('/startups',requireAuth, async (req, res) => {
    const startups = await StartupSale.find().sort({ createdAt: -1 }).limit(15);
    res.render('startup-listing', { startups });
});

app.get('/startup-sale-registration',requireAuth, (req, res) => {
    res.render('startup-sale-registration');
});

app.post('/startup-sale-registration', upload.fields([
    { name: 'registrationCertificate', maxCount: 1 },
    { name: 'mediaFiles', maxCount: 10 },
    { name: 'pitchDeck', maxCount: 1 }
]), async (req, res) => {
    try {
        const {
            startupName, founderName, email, phone, description,
            incorporationYear, location, legallyRegistered,
            monthlyRevenue, monthlyProfit, askingPrice, website,
            teamInfo, reasonForSelling
        } = req.body;

        const included = req.body['included[]'] || req.body.included || [];

        const registrationCertificate = req.files['registrationCertificate'] ? req.files['registrationCertificate'][0].path.replace('public', '') : '';
        const mediaFiles = req.files['mediaFiles'] ? req.files['mediaFiles'].map(f => f.path.replace('public', '')) : [];
        const pitchDeck = req.files['pitchDeck'] ? req.files['pitchDeck'][0].path.replace('public', '') : '';

        const startup = new StartupSale({
            startupName,
            founderName,
            email,
            phone,
            description,
            incorporationYear,
            location,
            legallyRegistered,
            registrationCertificate,
            monthlyRevenue,
            monthlyProfit,
            askingPrice,
            included: Array.isArray(included) ? included : [included],
            website,
            mediaFiles,
            pitchDeck,
            teamInfo,
            reasonForSelling
        });

        await startup.save();
        res.render('thank-you', { message: 'Thank you for registering your startup for sale!' });
    } catch (err) {
        console.error(err);
        res.status(500).render('error', { title: 'Error', message: 'Something went wrong!' });
    }
});

app.get('/contact', (req, res) => {
    res.render('contactUs');
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