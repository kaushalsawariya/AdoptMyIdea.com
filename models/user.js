const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/smg-electric')
.then(() => {
    console.log('Connected to MongoDB');
})

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
});
module.exports = mongoose.model('User', userSchema);