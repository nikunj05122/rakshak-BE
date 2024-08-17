const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err);
    // process.exit(1); -> code 1 stands for unCatch Exception.
    // process.exit(0); -> code 0 stands for Success.
    process.exit(1);
});

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
    '<PASSWORD>',
    process.env.DATABASE_PASSWORD
);

mongoose
    .connect(DB)
    .then((con) => {
        // console.info(con.connections);
        console.info('DB connection Successful!');
    });

const port = process.env.PORT || 5000;

app.listen(port, () => console.info(`server start on ${port}....`));

process.on('uncaughtException', err => {
    console.error('UNCAUGHT REJECTION! 💥 Shutting down...');
    console.error(err.name, err.message);
    console.error(err);
    // server.close() use for first close the all running and panding requestes in server after crash sever.
    server.close(() => {
        // process.exit(1); -> code 1 stands for unCatch Exception.
        // process.exit(0); -> code 0 stands for Success.
        process.exit(1);
    });
});