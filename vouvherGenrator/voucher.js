// Voucher generator: generates unique 8-character alphanumeric codes with random amounts

const generatedCodes = new Set();
const { encrypt, decrypt } = require('./encrypter');

function generate8CharCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code;
    do {
        code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
    } while (generatedCodes.has(code));
    generatedCodes.add(code);
    return code;
}

function generateRandomAmount(min = 10, max = 100) {
    // Generates a random amount between min and max (inclusive)
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateVoucher() {
    const code = generate8CharCode();
    const amount = generateRandomAmount();
    return { code, amount };
}

function generateVouchers(count = 1) {
    const vouchers = [];
    for (let i = 0; i < count; i++) {
        console.log(`Generating voucher ${i + 1} of ${count}`);
        vouchers.push(generateVoucher());
    }
    console.log(vouchers)
    return vouchers;
}

function getEncodedVouchers(count=1){
    const vouchers = generateVouchers(count);
    return vouchers.map(voucher => ({

        ...voucher,
        code: encrypt(voucher.code)
    }));
}

function getDecodedVouchers(encodedVouchers) {
    return encodedVouchers.map(voucher => ({
        ...voucher,
        code: decrypt(voucher.code)
    }));
}

function getEncodedVoucher(voucher){
    return encrypt(voucher);
}

module.exports = {
    getEncodedVouchers,
    getDecodedVouchers,
    getEncodedVoucher,
    generateVoucher,
};
