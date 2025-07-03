const fs = require('fs').promises;
const path = require('path');

async function logConsumerAction(code, amount, user) {
    const logLine = `${new Date().toISOString()} | code: ${code} | amount: ${amount} | user: ${user}\n`;
    const logPath = path.join(__dirname, 'consumer.txt');
    await fs.appendFile(logPath, logLine, 'utf8');
    console.log('Logged:', logLine.trim());
}


module.exports = { logConsumerAction };
