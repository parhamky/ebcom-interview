const {generateSingleVoucher ,  generateBulkVouchers , claimBulkVouchers,claimSingleVoucher,claimSingleVoucherWithUser} = require('../controllers/vouchers')

const generateSingleVoucherSchema = {
  params: {
    type: 'object',
    properties: {
      amount: { type: 'number', minimum: 0 }
    },
    required: ['amount']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        code: { type: 'string' },
        amount: { type: 'number' }
      },
      required: ['code', 'amount']
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }

  },
  handler: generateSingleVoucher
}

const generateBulkVouchersSchema = {
  params: {
    type: 'object',
    properties: {
      count: { type: 'integer', minimum: 1 }
    },
    required: ['count']
  },
  response: {
    200: {
    type: 'object',
    properties: {
      vouchers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            amount: { type: 'number' }
          },
          required: ['code', 'amount']
        }
      }
    },
    required: ['vouchers']
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  },
  handler: generateBulkVouchers
}

const claimSingleVoucherSchema = {
  body: {
    type: 'object',
    properties: {
      code: { type: 'string' },
      amount: { type: 'number' }
    },
    required: ['code', 'amount']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        amount: { type: 'number' }
      },
      required: ['status', 'amount']
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  },
  handler: claimSingleVoucher
}

const claimBulkVouchersSchema = {
  body: {
    type: 'object',
    properties: {
      vouchers: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            code: { type: 'string' },
            amount: { type: 'number' }
          },
          required: ['code', 'amount']
        }
      }
    },
    required: ['vouchers']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        count: { type: 'integer' }
      },
      required: ['status', 'count']
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  },
  handler: claimBulkVouchers
}

const claimSingleVoucherWithUserSchema = {
  body: {
    type: 'object',
    properties: {
      code: { type: 'string' },
      amount: { type: 'number' },
      user: { type: 'string' }
    },
    required: ['code', 'amount', 'user']
  },
  response: {
    200: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        amount: { type: 'number' },
        user: { type: 'string' }
      },
      required: ['status', 'amount', 'user']
    },
    400: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    },
    500: {
      type: 'object',
      properties: {
        error: { type: 'string' }
      }
    }
  },
  handler: claimSingleVoucherWithUser
}



const routes = async (fastify, opts) => {
  fastify.get('/voucher/:amount', generateSingleVoucherSchema)
  fastify.get('/voucher/bulk/:count', generateBulkVouchersSchema)
  fastify.post('/voucher/claim', claimSingleVoucherSchema)
  fastify.post('/voucher/claim-bulk', claimBulkVouchersSchema)
  fastify.post('/voucher/claim-with-user', claimSingleVoucherWithUserSchema)
}

module.exports = routes