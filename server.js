const { ensureMinVouchers } = require('./voucherManager.js');

const fastify = require('fastify')({ logger: true });
fastify.register(require('./routes/vouchers.js'));
const PORT = process.env.PORT || 3000;

ensureMinVouchers();

const start = async () => {
    try {
        await fastify.listen({port: PORT});
    } catch (error) {
        fastify.log.error(error)
        process.exit(1)
    }
}


start();
