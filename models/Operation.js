const mongoose = require('mongoose');
const validator = require('validator');

const OperationSchema = new mongoose.Schema(
    {
        location: {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number]
        },
        description: {
            type: String
        },
        number: {
            type: String,
            require: [true, 'Provide the number.'],
            validate: [validator.isMobilePhone, 'Please provide a valid number.'] // Validate the number.
        },
        facts: [{
            url: String,
            filePath: String,
            type: {
                type: String
            }
        }],
        user: {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        },
        officers: [
            {
                type: mongoose.Schema.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        timestamps: true
    }
);
OperationSchema.index({ location: '2dsphere' });

const Operation = mongoose.model('Operation', OperationSchema);

module.exports = Operation;