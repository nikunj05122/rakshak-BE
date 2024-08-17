const admin = require('firebase-admin');

const { firebaseAdminConfig } = require('./../constant/configFireBase');

admin.initializeApp({
    credential: admin.credential.cert(firebaseAdminConfig),
});

module.exports = { admin };