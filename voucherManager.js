const { getCollection,getCluster } = require('./db/couchbase');
const { getEncodedVouchers, getEncodedVoucher, getDecodedVouchers } = require('./vouvherGenrator/voucher');

let isRefilling = false;

async function generateVouchers(count = 200) {
    const collection = await getCollection();
    for (let i = 0; i < count; i++) {
        const vouchers = getEncodedVouchers();
        vouchers.forEach(async (voucher) => {
            try {
                console.log(`Storing voucher ${voucher.code} with amount ${voucher.amount}`);
                await collection.upsert(voucher.code, voucher);
            } catch (error) {
                console.error(`Error storing voucher ${voucher.code}:`, error);
            }
        })
    }
    console.log(`${count} encrypted vouchers generated and stored in the database.`);
}

async function validateVoucher(inputCode, inputAmount) {
    const collection = await getCollection();
    // Encode the inputCode using your own logic
    const fakeVoucher = { code: inputCode, amount: inputAmount };
    try {
        const encodedCode = getEncodedVoucher(fakeVoucher.code)   
        const result = await collection.get(encodedCode);
        const voucherDoc = result.content;
        console.log(voucherDoc)
        // Decode the code using your own logic
        if (voucherDoc.code === encodedCode && Number(voucherDoc.amount) === Number(inputAmount)) {
            console.log(`Voucher ${inputCode} with amount ${inputAmount} is valid.`);
            return true;
        } else {
            console.log(`Voucher ${inputCode} with amount ${inputAmount} is invalid.`);
            return false;
        }
    } catch (error) {
        console.log(`Voucher ${inputCode} with amount ${inputAmount} is invalid. error:`, error);
        return false;
    }
}

async function countAllVouchers() {
    const cluster = await getCluster();
    // Use N1QL to count all documents in the collection
    const query = 'SELECT COUNT(*) AS count FROM `vouchers`.`encrypted`.`encryptedvouchers`';
    const result = await cluster.query(query);
    const count = result.rows[0].count;
    console.log(`Total vouchers in database: ${count}`);
    return count;
}

async function ensureMinVouchers(min = 200) {
  if (isRefilling) return; // prevent overlap
  isRefilling = true;

  try {
    const count = await countAllVouchers();
    if (count >= min) return;
    const needed = min - count;
    await generateVouchers(needed);
  } catch (err) {
    console.error('Error in ensureMinVouchers:', err);
  } finally {
    isRefilling = false;
  }
}


module.exports = {
    validateVoucher,
    generateVouchers,
    countAllVouchers,
    ensureMinVouchers
};