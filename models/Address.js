const mongoose = require('mongoose');

const AddressSchema = new mongoose.Schema({
    city: {
        type: String,
        required: [true, 'Plaese provide city name.']
    },
    state: {
        type: String,
        required: [true, 'Plaese provide state name.']
    },
    address: {
        type: String,
        required: [true, 'Plaese provide address.']
    },
    type: {
        type: String,
        required: [true, 'Please provide address type.']
    },
    latitude: {
        type: Number,
        required: [true, "Please provide a latitude of address."]
    },
    longitude: {
        type: Number,
        required: [true, "Please provide a longitude of address."]
    },
    UserId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
},
    {
        timestamps: true
    });

const Address = mongoose.model('Address', AddressSchema);

module.exports = Address;