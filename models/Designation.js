const mongoose = require('mongoose');
const { ORGANIZATION } = require('./../constant/types');

const DesignationSchema = new mongoose.Schema({
    department: {
        type: String,
        enum: [...Object.values(ORGANIZATION)],
        required: [true, 'Plaese provide department of the designation.']
    },
    designation: {
        type: String,
        required: [true, 'Please provide proper designation.']
    },
    staff: {
        type: String,
        required: [true, 'Please provide staff']
    }
},
    {
        timestamps: true
    });

const Designation = mongoose.model('Designation', DesignationSchema);

module.exports = Designation;