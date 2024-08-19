const mongoose = require('mongoose');
const validator = require('validator');
const { ORGANIZATION } = require('./../constant/types');

const OrganizationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide proper name of organization.']
    },
    slug: String,
    number: [{
        type: String,
        required: [true, 'Please provide organization number.'],
        unique: true,
        validate: [validator.isMobilePhone, 'Please provide a valid number.']
    }],
    location: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number]
    },
    address: {
        type: String,
        require: [true, 'Organization must have a address'],
        trim: true,
    },
    img: {
        url: String,
        filePath: String,
        type: {
            type: String
        }
    },
    type: {
        type: String,
        enum: [...Object.values(ORGANIZATION)],
        require: [true, 'Provide right Organization type.'],
    },
    head: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    officers: [{
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    }]
},
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

OrganizationSchema.index({ slug: 1 });
OrganizationSchema.index({ location: '2dsphere' });

OrganizationSchema.pre('save', function (next) {
    this.slug = this.name.toLowerCase() + " " + this.address.toLowerCase(); //this keywork is refer to current document.
    next();
});

OrganizationSchema.pre(/^find/, function (next) {
    this.select("-__v");
    next();
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;