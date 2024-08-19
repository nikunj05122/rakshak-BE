const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const validator = require('validator');

const { USER } = require('./../constant/types');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please tell us your first name!']
    },
    lastName: {
        type: String,
        required: [true, 'Please tell us your last name!']
    },
    pin: {
        type: String,
        required: [true, 'Please Provide the PIN!'],
        select: false
    },
    pinConfirm: {
        type: String,
        require: [true, 'Please confirm your PIN.'],
        validate: {
            //  This only works on CREATE and SAVE!!!
            validator: function (el) {
                return el === this.pin;
            },
            message: 'PIN are not the same!'
        }
    },
    role: {
        type: String,
        enum: [...Object.values(USER)],
        require: [true, 'Provide right user role.'],
        default: USER.USER
    },
    number: {
        type: String,
        require: [true, 'Provide the number.'],
        unique: true,
        validate: [validator.isMobilePhone, 'Please provide a valid number.'] // Validate the number.
    },
    email: {
        type: String,
        require: [true, 'Provide the email.'],
        unique: true,
        validate: [validator.isEmail, 'Please provide a valid email.'] // Validate the number.
    },
    active: {
        type: Boolean,
        default: true,
        select: false
    },
    // fcmToken: String,
    designation: {
        type: mongoose.Schema.ObjectId,
        ref: 'Designation'
    },
    webToken: String,
    profileImg: {
        url: String,
        filePath: String,
        type: {
            type: String
        }
    }
},
    {
        timestamps: true
    });

UserSchema.pre('save', async function (next) {
    // Only run this function if PIN was actually not modified.
    if (!this.isModified('pin')) return next();

    // Hash the PIN with cost of 12
    this.pin = await bcrypt.hash(this.pin, 12);


    // Delete pinConfirm field
    this.pinConfirm = undefined;
    next();
});

UserSchema.pre(/^find/, function (next) {
    this.find({ active: { $ne: false } });
    next();
});

UserSchema.methods.correctPIN = async function (candidateMPIN, userMPIN) {
    return await bcrypt.compare(candidateMPIN, userMPIN);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;