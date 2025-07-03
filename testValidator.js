const { getCollection } = require('./db/couchbase');
const { getEncodedVouchers, getEncodedVoucher } = require('./vouvherGenrator/voucher');
const { validateVoucher } = require('./voucherManager');

(async () => {
    // 1. Generate a voucher
    const amount = Math.floor(Math.random() * 90) + 10; // random amount between 10 and 99
    const plainVoucher = { code: Math.random().toString(36).substr(2, 8), amount };
    // 2. Encode and store in DB
    const encodedVoucher = getEncodedVoucher(plainVoucher.amount);
    const collection = await getCollection();
    await collection.upsert(encodedVoucher.code, encodedVoucher);
    console.log('Inserted voucher:', plainVoucher);
    // 3. Validate
    await validateVoucher(plainVoucher.code, plainVoucher.amount);
})();
