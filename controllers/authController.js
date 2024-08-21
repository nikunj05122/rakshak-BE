const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const User = require('./../models/User');
const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const giveResponse = require('./../middleware/response');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res, message) => {
    const token = signToken(user._id);
    const cookieOption = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    }

    if (process.env.NODE_ENV === 'production') cookieOption.secure = true; // Cookie only send in encryption connection (Basically we are only using HTTPS)

    res.cookie('jwt', token, cookieOption);

    user.password = undefined;

    return giveResponse(res, statusCode, "Success", message, { token, user });
}

exports.signUp = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        pin: req.body.pin,
        pinConfirm: req.body.pinConfirm,
        role: req.body.role ? req.body.role : undefined,
        number: req.body.number,
        email: req.body.email,
    });

    newUser.pin = undefined;
    newUser.active = undefined;
    newUser.webToken = undefined;

    return createSendToken(newUser, 201, res, 'User was created.');
});

exports.login = catchAsync(async (req, res, next) => {
    const { number, email, pin } = req.body;

    //  1) Check number and pin exist
    if ((!number && !email) || !pin)
        return next(new AppError('Please provide number and pin!', 400));

    //  2) Check user existd && pin is correct
    let user = await User.findOne({ $or: [{ number: number }, { email: email }] }).select('+pin +active');

    if (!user || !user.active) {
        return next(new AppError('Unauthorized user.', 401));
    }

    if (!(await user.correctPIN(pin, user.pin))) {
        return next(new AppError('Incorrect number or pin', 401));
    }

    if (req.body.webToken) {
        user.webToken = req.body.webToken;
        user = await user.save();
    }

    //  3) If everything is ok, send the token client
    const token = signToken(user._id);
    user.pin = undefined;
    user.active = undefined;
    user.webToken = undefined;

    return createSendToken(user, 200, res, 'User was logedIn.');
});

exports.protect = catchAsync(async (req, res, next) => {
    //  1) Getting token and check of it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }
    //  2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    //  3) Check if user still exists  
    const currentUser = await User.findById(decoded.id).select("+active");

    if (!currentUser)
        return next(new AppError('Unauthorized user.', 401));

    if (!currentUser.active) {
        return next(new AppError('Unauthorized user.', 401));
    }

    currentUser.active = undefined;
    //  GRAND ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new AppError('You do not have permission to perform this action', 403));
        }
        next();
    }
}