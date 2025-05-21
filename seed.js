
const mongoose = require('mongoose');
const StartupSale = require('./models/StartupSale'); // Adjust path if needed

mongoose.connect('mongodb+srv://singhgarvita550:Hig1h1K3NDZjEm2g@cluster0.shqofha.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Helper arrays for randomization
const startupPrefixes = ['Tech', 'Green', 'Smart', 'Next', 'Innovate', 'Future', 'Grow', 'Spark', 'Quantum', 'Eco', 'Bio', 'Data', 'Cloud', 'AI', 'Health'];
const startupSuffixes = ['Labs', 'Solutions', 'Systems', 'Works', 'Hub', 'Technologies', 'Ventures', 'Innovations', 'Corp', 'Group', 'Platform', 'App', 'Care', 'Energy'];
const industries = ['EdTech', 'HealthTech', 'FinTech', 'E-Commerce', 'SaaS', 'FoodTech', 'GreenTech', 'LegalTech', 'PropTech', 'AI', 'IoT', 'Logistics', 'TravelTech', 'Gaming', 'AdTech'];
const cities = ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Gurgaon'];
const firstNames = ['Amit', 'Neha', 'Rohan', 'Sakshi', 'Arjun', 'Priya', 'Vikram', 'Anjali', 'Rahul', 'Meera', 'Siddharth', 'Kavita', 'Aditya', 'Pooja', 'Nikhil'];
const lastNames = ['Sharma', 'Verma', 'Mehta', 'Taneja', 'Sinha', 'Patel', 'Singh', 'Gupta', 'Kumar', 'Jain', 'Reddy', 'Nair', 'Chopra', 'Das', 'Rao'];
const domains = ['.com', '.io', '.in', '.co', '.tech', '.ai', '.app'];
const includedOptions = ['Website/Domain', 'Codebase/App', 'Customer/User Data', 'Social Media Accounts'];
const reasonsForSelling = [
  'Pursuing new venture', 
  'Moving abroad', 
  'Lack of time', 
  'Funding challenges', 
  'Joining another company', 
  'Retirement', 
  'Strategic pivot', 
  'Personal reasons'
];

// Helper function to generate random phone number
function generatePhone() {
  return '9' + Math.floor(Math.random() * 900000000 + 100000000);
}

// Helper function to generate random email
function generateEmail(firstName, lastName, startupName) {
  return `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${startupName.toLowerCase()}${domains[Math.floor(Math.random() * domains.length)]}`;
}

// Helper function to generate random number within a range
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate 100 random startups
const startups = Array.from({ length: 100 }, (_, index) => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const startupName = `${startupPrefixes[Math.floor(Math.random() * startupPrefixes.length)]}${startupSuffixes[Math.floor(Math.random() * startupSuffixes.length)]}`;
  const industry = industries[Math.floor(Math.random() * industries.length)];
  const year = randomInRange(2015, 2025);
  const revenue = randomInRange(5000, 50000);
  const profit = Math.floor(revenue * randomInRange(10, 40) / 100); // Profit is 10-40% of revenue
  const askingPrice = randomInRange(profit * 12 * 2, profit * 12 * 5); // Asking price is 2-5x annual profit
  const location = `${cities[Math.floor(Math.random() * cities.length)]}, India`;

  return {
    startupName,
    founderName: `${firstName} ${lastName}`,
    email: generateEmail(firstName, lastName, startupName),
    phone: generatePhone(),
    description: `A ${industry} startup offering innovative solutions in ${industry.toLowerCase()}.`,
    incorporationYear: year,
    location,
    legallyRegistered: Math.random() > 0.2 ? 'Yes' : 'No', // 80% chance of being registered
    registrationCertificate: `https://example.com/docs/${startupName.toLowerCase()}_cert.pdf`,
    monthlyRevenue: revenue,
    monthlyProfit: profit,
    askingPrice,
    included: includedOptions.filter(() => Math.random() > 0.3).slice(0, randomInRange(1, includedOptions.length)), // Random subset
    website: `https://${startupName.toLowerCase()}${domains[Math.floor(Math.random() * domains.length)]}`,
    mediaFiles: [`https://example.com/images/${startupName.toLowerCase()}_screenshot.jpg`],
    pitchDeck: Math.random() > 0.5 ? `https://example.com/docs/pitch_${startupName.toLowerCase()}.pdf` : undefined,
    teamInfo: Math.random() > 0.3 ? `Team of ${randomInRange(1, 10)} including developers and marketers` : undefined,
    reasonForSelling: reasonsForSelling[Math.floor(Math.random() * reasonsForSelling.length)]
  };
});

// Insert into MongoDB
StartupSale.insertMany(startups)
  .then(() => {
    console.log('Successfully seeded 100 startups!');
    mongoose.connection.close();
  })
  .catch((err) => {
    console.error('Error seeding database:', err);
    mongoose.connection.close();
  });