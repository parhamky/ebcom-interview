const assert = require('assert');
const { encrypt, decrypt } = require('./encrypter');
const { generateVoucher, getEncodedVoucher } = require('./voucher');

// Set up test environment
process.env.SECRET_KEY = 'test-secret-key';

// Simple test runner
function runTests() {
  console.log('Running Voucher Tests...\n');

  // Test 1: Encryption works
  console.log('Test 1: Encryption/Decryption');
  try {
    const text = 'ABC123XY';
    const encrypted = encrypt(text);
    const decrypted = decrypt(encrypted);
    
    assert(encrypted !== text, 'Text should be encrypted');
    assert(decrypted === text, 'Decrypted text should match original');
    console.log('✅ PASS\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 2: Voucher generation
  console.log('Test 2: Voucher Generation');
  try {
    const voucher = generateVoucher();
    
    assert(voucher.code.length === 8, 'Code should be 8 characters');
    assert(typeof voucher.amount === 'number', 'Amount should be a number');
    assert(voucher.amount >= 10 && voucher.amount <= 100, 'Amount should be between 10-100');
    console.log('✅ PASS\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 3: Unique codes
  console.log('Test 3: Unique Code Generation');
  try {
    const voucher1 = generateVoucher();
    const voucher2 = generateVoucher();
    
    assert(voucher1.code !== voucher2.code, 'Codes should be unique');
    console.log('✅ PASS\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 4: Code encoding
  console.log('Test 4: Code Encoding');
  try {
    const plainCode = 'TEST1234';
    const encoded = getEncodedVoucher(plainCode);
    const decoded = decrypt(encoded);
    
    assert(encoded !== plainCode, 'Code should be encoded');
    assert(decoded === plainCode, 'Decoded code should match original');
    console.log('✅ PASS\n');
  } catch (error) {
    console.log('❌ FAIL:', error.message, '\n');
  }

  // Test 5: Invalid decryption
  console.log('Test 5: Invalid Decryption Handling');
  try {
    decrypt('invalid-data');
    console.log('❌ FAIL: Should have thrown error\n');
  } catch (error) {
    console.log('✅ PASS: Correctly threw error\n');
  }

  console.log('All tests completed!');
}

// Run the tests
runTests();