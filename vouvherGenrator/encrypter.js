const crypto = require('crypto');
require('dotenv').config();

const SECRET_KEY = crypto.createHash('sha256').update(process.env.SECRET_KEY).digest(); // 32-byte key
const IV = Buffer.alloc(16, 0); // 16-byte fixed IV

function encrypt(text) {
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, IV);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
}

function decrypt(encryptedText) {
    const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, IV);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}


module.exports = {
    encrypt,
    decrypt
};
