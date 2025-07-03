const { getCollection } = require('../db/couchbase')
const {generateVoucher,getEncodedVoucher} = require('../vouvherGenrator/voucher')
const {validateVoucher,ensureMinVouchers} = require('../voucherManager.js')
const { logConsumerAction } = require('../consumer.js') 

exports.generateSingleVoucher = async (req, reply) => {
  try {
    const amount = parseFloat(req.params.amount)
    if (isNaN(amount) || amount < 0) {
      return reply.code(400).send({ error: 'Invalid amount parameter' })
    }

    const code = generateVoucher()
    code.amount = amount
    const encrypted = getEncodedVoucher(code.code)
    const collection = await getCollection()

    await collection.insert(encrypted , { code: encrypted, amount })

    reply.code(200).send(code)
  } catch (err) {
    reply.code(500).send({ error: 'Failed to generate voucher' })
  }
}

exports.generateBulkVouchers = async (req, reply) => {
  try {
    const count = parseInt(req.params.count)
    if (isNaN(count) || count < 1) {
      return reply.code(400).send({ error: 'Invalid amount or count parameter' })
    }

    const collection = await getCollection()
    const vouchers = []

    for (let i = 0; i < count; i++) {
      const code = generateVoucher()
      const encrypted = getEncodedVoucher(code.code)
      await collection.insert(encrypted , { code: encrypted, amount: code.amount })
      vouchers.push(code)
    }

    reply.code(200).send({'vouchers': vouchers })
  } catch (err) {
    reply.code(500).send({ error: 'Failed to generate vouchers' })
  }
}

exports.claimSingleVoucher = async (req, reply) => {
  try {
    const { code, amount } = req.body
    const collection = await getCollection()
    const encrypted = getEncodedVoucher(code)
    
    if (await validateVoucher(code, amount)) {
      const {cas} = collection.get(encrypted)
        await collection.remove(encrypted,{ cas })
        reply.code(200).send({ status: 'claimed', amount })
        await ensureMinVouchers(200) // Ensure minimum vouchers after claiming
    }else{
      return reply.code(400).send({ error: 'Validation failed' })
    }
  } catch (err) {
    console.log(err)
    reply.code(500).send({ error: 'Claim failed' })
  }
}

exports.claimBulkVouchers = async (req, reply) => {
  try {
    const collection = await getCollection()
    const vouchers = req.body.vouchers

    for (const { code, amount } of vouchers) {
      if (!(await validateVoucher(code, amount))) {
        return reply.code(400).send({ error: 'Validation failed' })
      }
    }

    for (const { code } of vouchers) {
      const encrypted = getEncodedVoucher(code)

        const {cas} = collection.get(encrypted)

      await collection.remove(encrypted,{cas})
      await ensureMinVouchers(200) // Ensure minimum vouchers after claiming
    }
    reply.code(200).send({ status: 'claimed', count: vouchers.length })
  } catch (err) {
    reply.code(500).send({ error: 'Bulk claim failed' })
  }
}

exports.claimSingleVoucherWithUser = async (req, reply) => {
  try {
    const { code, amount, user } = req.body
    if (typeof user !== 'string' || user.trim() === '') {
      return reply.code(400).send({ error: 'Invalid user parameter' })
    }

    const collection = await getCollection()
    const encrypted = getEncodedVoucher(code)

    const doc = await collection.get(encrypted)
    const storedAmount = doc.content.amount

    if (await validateVoucher(code, storedAmount)) {
        const {cas} = collection.get(encrypted)
      await collection.remove(encrypted,{ cas })
        await ensureMinVouchers()
      await logConsumerAction(code, storedAmount, user)
      reply.code(200).send({ status: 'claimed', amount: storedAmount, user })
    } else {
      return reply.code(400).send({ error: 'Validation failed' })
    }
  } catch (err) {
    console.error('Claim with user error:', err)
    reply.code(500).send({ error: 'Claim failed' })
  }
}

