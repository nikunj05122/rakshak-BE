const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const xss = require('xss-clean');
const express = require('express');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const UserRoutes = require('./routes/UserRoutes');
const UploadRoutes = require('./routes/UploadRoutes');
const DesignationRoutes = require('./routes/DesignationRoutes');
const OrganizationRoutes = require('./routes/OrganizationRoutes');

const app = express();

app.use(cors());

// Set security HTTP headers
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
}));

// Limit requests from same API
// const limiter = rateLimit({
//     max: 100, // Max IP is send reqest on perticular time
//     windowMs: 60 * 60 * 1000, // That perticular time is windowMs (means windowsmiliseconds)
//     message: 'Too many requests from this IP, please try again in an hour!' // ERROR message rech the req max / windowsMs.
// });

// app.use('/api', limiter); // Apply on that routes start with '/api' (Means all routes)

// Development logging  
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Body parser, reding data from the body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS (Cross - site scripting attacks)
app.use(xss());

app.use('/api/v1/users', UserRoutes);
app.use('/api/v1/file', UploadRoutes);
app.use('/api/v1/designation', DesignationRoutes);
app.use('/api/v1/organization', OrganizationRoutes);

app.all('*', (req, res, next) => {
    next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
