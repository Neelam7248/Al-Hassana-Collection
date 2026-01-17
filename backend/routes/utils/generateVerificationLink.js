const crypto = require('crypto');
const verificationToken = crypto.randomBytes(32).toString('hex');
